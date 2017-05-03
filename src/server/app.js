'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');
const ejsExtend = require('express-ejs-extend');
const socketIo = require('socket.io');

const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');
const github = require('./lib/github.js');

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
	.use('/', indexRouter)
	.use('/auth', authRouter);

const server = app.listen(port, host, err => {
	err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
});

let users = [];
const sockets = [];

socketIo(server)
	.on('connection', socket => {
		console.log(`Client ${socket.id} connected`);

		socket
			.on('publishUser', onPublishUser)
			.on('registerUsers', onRegisterUsers)
			.on('disconnect', onDisconnect);

		function onPublishUser(user) {
			socket.user = user;
			socket.user.option = 'currentWeek';
			let matchingUser = findMatchingUser(user.login);
			if (matchingUser) {
				matchingUser.active = true;
			} else {
				matchingUser = user;
				user.active = true;
				users.push(user);
			}
			sockets.push(socket);
			updateCommitsCount();
			emitUsers();
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
			emitUsersToSingle(socket);
		}

		function onDisconnect() {
			if (socket.user) {
				const matchingUser = findMatchingUser(socket.user.login);
				if (matchingUser) {
					matchingUser.active = false;
					emitUsers();
				}
			}
			const socketIndex = sockets.map((single, i) => {
				if (socket.id === single.id) {
					return i;
				}
			});
			sockets.splice(socketIndex, 1);
			console.log(sockets);
			console.log(`${socket.id} disconnected`);
		}
	});

// setInterval(updateCommitsCount, 10000);

function getMonday(d) {
	d = new Date(d);
	const day = d.getDay();
	const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
	return new Date(d.setDate(diff));
}

function updateCommitsCount() {
	const dateLimits = {
		currentWeek: getMonday(new Date()).getTime(),
		lastWeek: getMonday(new Date().setDate(new Date().getDate() - 7)).getTime(),
		twoWeeksAgo: getMonday(new Date().setDate(new Date().getDate() - 14)).getTime()
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
					} else if (timestamp < dateLimits.lastWeek && timestamp > dateLimits.twoWeeksAgo) {
						scores.twoWeeksAgo++;
					}
				});
				user.scores = scores;
				emitUsers();
			});
		})
		.catch(err => {
			console.log(err);
		});
	});
	if (users.find(user => {
		return user.active;
	})) {
		Promise.all(promises)
		.then(() => {
			emitUsers();
		});
	}
}

function findMatchingUser(login) {
	return users.find(user => {
		return user.login === login;
	});
}

function emitUsers() {
	sockets.forEach(socket => {
		emitUsersToSingle(socket);
	});
}

function emitUsersToSingle(socket) {
	const users = getPublicUsers(socket.user.option);
	socket.emit('publishUsers', users);
}

function getPublicUsers(option) {
	users = users.filter(user => {
		return user.name.length > 0;
	});
	return users.map(user => {
		return {
			name: user.name,
			login: user.login,
			active: user.active,
			score: user.scores ? user.scores[option] : null
		};
	});
}