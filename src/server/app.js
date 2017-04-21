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

const users = [];

const io = socketIo(server)
	.on('connection', socket => {
		console.log(`Client ${socket.id} connected`);

		socket.on('setUser', user => {
			socket.user = user;
			console.log(user);
			const matchingUser = users.find(user => {
				return user.login === socket.user.login;
			});
			if (matchingUser) {
				matchingUser.active = true;
			} else {
				user.active = true;
				users.push(user);
			}

			// github.getRepos(user, user.token)
			// .then(repos => {
			// 	github.getCommits(repos, user.token)
			// 	.then(commits => {
			// 		// users.forEach(user => {
			// 		// 	if (user)
			// 		// });
			// 		// console.log(commits);
			// 		// res.render('authenticated/index', {
			// 		// 	token,
			// 		// 	user,
			// 		// 	commits
			// 		// });
			// 	});
			// });
			io.emit('userRegistration', getPublicUsers());
		});

		socket.on('disconnect', () => {
			users.find(user => {
				return user.login === socket.user.login;
			}).active = false;
			io.emit('userRegistration', getPublicUsers());
			console.log(`${socket.id} disconnected`);
		});
	});

function getPublicUsers() {
	return users.map(user => {
		return {
			name: user.name,
			login: user.login,
			active: user.active
		};
	});
}