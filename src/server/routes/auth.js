const express = require('express');

const request = require('./../lib/request.js');
const cfg = require('./../../cfg.js');
const getParams = require('./../lib/params.js');

const router = express.Router()
	.get('/', getHandshake)
	.get('/token', completeAuth);

function getHandshake(req, res) {
	res.redirect(`${cfg.github.oAuthUrl}/authorize?client_id=${cfg.github.clientId}&redirect_uri=${cfg.app.baseUrl}/auth/token&scope=public_repo,user`);
}

function completeAuth(req, res) {
	getToken(req.query.code)
	.then(token => {
		getUser(token)
	.then(user => {
		getRepos(user, token)
	.then(repos => {
		getCommits(repos, token)
	.then(commits => {
		console.log(commits);
		res.render('authenticated/index', {
			token,
			user,
			commits
		});
	});
	});
	});
	});
}

function getToken(code) {
	return new Promise((resolve, reject) => {
		const options = generateOptions(`${cfg.github.oAuthUrl}/access_token?client_id=${cfg.github.clientId}&client_secret=${cfg.github.secret}&code=${code}&redirect_uri=${cfg.app.baseUrl}/auth/token`);
		request('post', options)
			.then(body => {
				resolve(getParams(body).access_token);
			})
			.catch(err => {
				reject(err);
			});
	});
}

function getUser(token) {
	return new Promise((resolve, reject) => {
		const options = generateOptions(`${cfg.github.apiUrl}/user`, token);
		request('get', options)
			.then(user => {
				resolve(JSON.parse(user));
			})
			.catch(err => {
				reject(err);
			});
	});
}

function getRepos(user, token) {
	return new Promise((resolve, reject) => {
		const options = generateOptions(`${cfg.github.apiUrl}/users/${user.login}/repos`, token);
		request('get', options)
			.then(repos => {
				resolve(JSON.parse(repos));
			})
			.catch(err => {
				reject(err);
			});
	});
}

function getCommits(repos, token) {
	return new Promise((resolve, reject) => {
		const commitsRequests = repos.map(repo => {
			const options = generateOptions(`${cfg.github.apiUrl}/repos/${repo.full_name}/commits`, token);
			return request('get', options);
		});
		Promise.all(commitsRequests)
			.then(commits => {
				commits = commits.map(singleRepoCommits => {
					singleRepoCommits = JSON.parse(singleRepoCommits);
					return singleRepoCommits.map(commit => {
						return {
							author: commit.author,
							commit: commit.commit
						};
					});
				});
				resolve(commits);
			})
			.catch(err => {
				reject(err);
			});
	});
}

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

module.exports = router;