const express = require('express');

const cfg = require('./../../cfg.js');
const github = require('./../lib/github.js');

const router = express.Router()
	.get('/', getHandshake)
	.get('/token', completeAuth);

function getHandshake(req, res) {
	res.redirect(`${cfg.github.oAuthUrl}/authorize?client_id=${cfg.github.clientId}&redirect_uri=${cfg.app.baseUrl}/auth/token&scope=public_repo,user`);
}

function completeAuth(req, res) {
	github.getToken(req.query.code)
	.then(token => {
		github.getUser(token)
	.then(user => {
		res.render('authenticated/index', {
			token,
			user
		});
	});
	});
}

module.exports = router;