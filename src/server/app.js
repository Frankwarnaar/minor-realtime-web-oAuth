'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');
const ejsExtend = require('express-ejs-extend');
const socketIo = require('socket.io');
const session = require('express-session');

const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');
const github = require('./lib/github.js');
const util = require('./lib/util.js');

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const baseDir = 'dist';

const app = express()
	.engine('ejs', ejsExtend)
	.set('views', path.join(__dirname, './views'))
	.set('view engine', 'ejs')
	.use(compression())
	.use(staticAsset(baseDir))
	.use(express.static(baseDir, {
		maxAge: 31557600000 // one year
	}))
	.use(session({
		secret: "FDSfaeo78rafrgf7earh78hr78g",
		resave: false,
		saveUninitialized: true
	}))
	.use('/', indexRouter)
	.use('/auth', authRouter);

const server = app.listen(port, host, err => {
	err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
});

const sockets = [];
let users = [];
let sourceOffline = false;

const io = socketIo(server)
	.on('connection', socket => {
		console.log(`Client ${socket.id} connected`);
		sockets.push(socket);

		socket
			.on('publishUser', onPublishUser)
			.on('publishNewUser', onPublishNewUser)
			.on('registerUsers', onRegisterUsers)
			.on('disconnect', onDisconnect);

		function onPublishUser(user) {
			socket.user = user;
			if (!socket.user.option) {
				socket.user.option = 'currentWeek';
			}
			let matchingUser = util.findMatchingUser(users, user.login);

			if (matchingUser) {
				matchingUser.active = true;
			} else {
				matchingUser = user;
				user.active = true;
				users.push(user);
			}

			updateCommitsCount();
		}

		function onPublishNewUser(username, token) {
			if (!util.findMatchingUser(users, username)) {
				users.push({
					login: username,
					token,
					active: false
				});
				updateCommitsCount();
			}
		}

		function onRegisterUsers(option) {
			if (socket.user) {
				socket.user.option = option;
			} else {
				socket.user = {
					option
				};
			}
			const currentSocket = sockets.find(single => {
				return socket.id === single.id;
			});
			currentSocket.option = option;
			emit.usersToSingle(users, socket);
		}

		function onDisconnect() {
			if (socket.user) {
				const matchingUser = util.findMatchingUser(users, socket.user.login);
				if (matchingUser) {
					matchingUser.active = false;
					emit.users(users);
				}
			}
			const socketIndex = sockets.map((single, i) => {
				if (socket.id === single.id) {
					return i;
				}
			});
			sockets.splice(socketIndex, 1);
			console.log(`${socket.id} disconnected`);
		}
	});

setInterval(() => {
	if (users.find(user => user.active)) {
		updateCommitsCount()
	}
}, 10000);

function updateCommitsCount() {
	const dateLimits = {
		currentWeek: util.getMonday(new Date()).getTime(),
		lastWeek: util.getMonday(new Date().setDate(new Date().getDate() - 7)).getTime(),
		twoWeeksAgo: util.getMonday(new Date().setDate(new Date().getDate() - 14)).getTime()
	};
	const promises = users.map(user => {
		return github.getRepos(user, user.token)
		.then(repos => {
			github.getCommits(repos, user.token)
			.then(commits => {
				commits = Array.prototype.concat(...commits);
				const scores = {
					currentWeek: 0,
					lastWeek: 0,
					twoWeeksAgo: 0
				};

				commits.forEach(commit => {
					const timestamp = new Date(commit.commit.author.date).getTime();
					if (timestamp > dateLimits.currentWeek) {
						scores.currentWeek++;
					} else if (timestamp < dateLimits.currentWeek && timestamp > dateLimits.lastWeek) {
						scores.lastWeek++;
					} else {
						scores.twoWeeksAgo++;
					}
				});
				user.scores = scores;
				emit.users(users);

				if (sourceOffline) {
					emit.sourceOffline(false);
				}
			});
		})
		.catch(err => {
			emit.sourceOffline(true);
			console.log(err);
		});
	});
	if (users.find(user => {
		return user.active;
	})) {
		Promise.all(promises)
		.then(() => {
			emit.users(users);
		});
	}
}

const emit = {
	users(users) {
		sockets.forEach(socket => {
			this.usersToSingle(users, socket);
		});
	},
	usersToSingle(users, socket) {
		const publicUsers = util.getPublicUsers(users, socket.user.option);
		socket.emit('publishUsers', publicUsers);
	},
	sourceOffline(offline) {
		sourceOffline = offline;
		io.emit('publishSourceState', state);
	}
}