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

const io = socketIo(server)
	.on('connection', socket => {
		console.log(`Client ${socket.id} connected`);

		socket.on('setUser', user => {
			socket.user = user;
			let matchingUser = findMatchingUser(user.login);
			if (matchingUser) {
				matchingUser.active = true;
			} else {
				matchingUser = user;
				user.active = true;
				users.push(user);
			}
			updateCommitsCount();
		});

		socket.on('disconnect', () => {
			if (socket.user) {
				const matchingUser =  findMatchingUser(socket.user.login);
				if (matchingUser) {
					matchingUser.active = false;
					emitUsers();
				}
			}
			console.log(`${socket.id} disconnected`);
		});
	});

setInterval(updateCommitsCount, 10000);

function updateCommitsCount() {
	const promises = users.map(user => {
		return github.getRepos(user, user.token)
		.then(repos => {
			github.getCommits(repos, user.token)
			.then(commits => {
				user.commits = Array.prototype.concat(...commits).length;
				emitUsers();
			});
		})
		.catch(err => {
			console.log(err);
		});
	});
	Promise.all(promises)
		.then(() => {
			emitUsers();
		});
}

function findMatchingUser(login) {
	return users.find(user => {
		return user.login === login;
	});
}

function emitUsers() {
	users = users.sort((a, b) => {
		return b.commits - a.commits;
	});
	
	io.emit('userRegistration', getPublicUsers());
}

function getPublicUsers() {
	users = users.filter(user => {
		return user.name.length > 0;
	});
	return users.map(user => {
		return {
			name: user.name,
			login: user.login,
			active: user.active,
			commits: user.commits
		};
	});
}