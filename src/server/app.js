'use strict';

const path = require('path');
const express = require('express');
const compression = require('compression');
const staticAsset = require('static-asset');

require('dotenv').config();

const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
const baseDir = 'dist';

const app = express()
	.engine('ejs', require('express-ejs-extend'))
	.set('views', path.join(__dirname, './views'))
	.set('view engine', 'ejs')
	.use(compression())
	.use(staticAsset(baseDir))
	.use(express.static(baseDir, {
		maxAge: 31557600000 // one year
	}))
	.get('/', (req, res) => {
		res.render('index');
	});

const server = app.listen(port, host, err => {
	err ? console.error(err) : console.log(`app running on http://localhost:${port}`);
});

require('socket.io')(server)
	.on('connection', socket => {
		console.log(`Client ${socket.id} connected`);

		socket.on('message', message => {
			io.sockets.emit('message', message);
		});

		socket.on('disconnect', () => {
			console.log(`${socket.id} disconnected`);
		});
	});