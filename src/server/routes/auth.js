const express = require('express');

const request = require('./../lib/request.js');
const cfg = require('./../../cfg.js');
const getParams = require('./../lib/params.js');

const router = express.Router()
	.get('/', getHandshake)
	.get('/token', getToken);

function getHandshake(req, res) {
	res.redirect(`${cfg.github.oAuthUrl}/authorize?client_id=${cfg.github.clientId}&redirect_uri=${cfg.app.baseUrl}/auth/token&scope=public_repo,user`);
}

function getToken(req, res) {
	const options = {
		url: `${cfg.github.oAuthUrl}/access_token?client_id=${cfg.github.clientId}&client_secret=${cfg.github.secret}&code=${req.query.code}&redirect_uri=${cfg.app.baseUrl}/auth/token`
	};
	request('post', options).then(body => {
		const token = getParams(body).access_token;
		const options = {
			url: `${cfg.github.apiUrl}/user`,
			headers: {
				'User-Agent': cfg.app.name,
				Authorization: `token ${token}`
			}
		};
		request('get', options).then(results => {
			results = JSON.parse(results);
			res.render('authenticated/index', {
				token,
				username: results.login
			});
		});
	});
}

module.exports = router;