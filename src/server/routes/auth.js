const express = require('express');
const request = require('./../lib/request.js');

const cfg = require('./../../cfg.js');

const router = express.Router()
	.get('/', getHandshake)
	.get('/token', getToken);

function getHandshake(req, res) {
	res.redirect(`${cfg.github.oAuthUrl}/authorize?client_id=${cfg.github.clientId}&redirect_uri=${cfg.app.baseUrl}/auth/token&scope=public_repo`);
}

function getToken(req, res) {
	const url = `${cfg.github.oAuthUrl}/access_token?client_id=${cfg.github.clientId}&client_secret=${cfg.github.secret}&code=${req.query.code}&redirect_uri=${cfg.app.baseUrl}/auth/token`;
	request('post', url)
		.then((body, response) => {
			console.log(body);
			res.render('index');
		});
}

module.exports = router;