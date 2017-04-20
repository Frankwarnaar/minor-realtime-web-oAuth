'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');
const ejsExtend = require('express-ejs-extend');
const io = require('socket.io');

const indexRouter = require('./routes/index.js');
const authRouter = require('./routes/auth.js');

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
	.use('/auth', authRouter)
	.use(socketMiddleware);

const server = app.listen(port, host, err => {
	err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
});

const socket = io(server)
	.on('connection', socket => {
		// console.log(`Client ${socket.id} connected`);

		socket.on('message', message => {
			io.sockets.emit('message', message);
		});

		socket.on('disconnect', () => {
			// console.log(`${socket.id} disconnected`);
		});
	});

function socketMiddleware(req, res, next) {
	req.socket = socket;
	next();
}