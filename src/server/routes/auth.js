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
			github.getUser(token).then(user => {
				if (user.login) {
					req.session.user = user;
					req.session.token = token;
				}

				if (req.session.user) {
					res.render('authenticated/index', {
						token: req.session.token,
						user: req.session.user
					});
				} else {
					res.redirect('/');
				}
			});
		});
}

module.exports = router;