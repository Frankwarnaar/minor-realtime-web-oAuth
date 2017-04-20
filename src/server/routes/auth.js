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
	function generateOptions(url, token) {
		const options = {
			url,
			headers: {
				'User-Agent': cfg.app.name
			}
		};

		if (token) {
			options.headers.Authorization = `token ${token}`;
		}

		return options;
	}

	request('post', generateOptions(`${cfg.github.oAuthUrl}/access_token?client_id=${cfg.github.clientId}&client_secret=${cfg.github.secret}&code=${req.query.code}&redirect_uri=${cfg.app.baseUrl}/auth/token`)).then(body => {
		const token = getParams(body).access_token;
		request('get', generateOptions(`${cfg.github.apiUrl}/user`, token)).then(user => {
			user = JSON.parse(user);
			const login = user.login;
			const options = generateOptions(`${cfg.github.apiUrl}/users/${login}/repos`, token);
			console.log(options);
			request('get', options).then(repos => {
				repos = JSON.parse(repos);
				console.log(repos);
				res.render('authenticated/index', {
					token,
					username: login
				});
			});
		}).catch(err => {
			console.log(err);
		});
	});
}

module.exports = router;