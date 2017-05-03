const request = require('./request.js');
const getParams = require('./params.js');
const util = require('./util.js');
const emit = require('./emit.js');
const cfg = require('./../../cfg.js');

let sourceOffline = false;

module.exports = {
	getToken(code) {
		return new Promise((resolve, reject) => {
			const options = this.generateOptions(`${cfg.github.oAuthUrl}/access_token?client_id=${cfg.github.clientId}&client_secret=${cfg.github.secret}&code=${code}&redirect_uri=${cfg.app.baseUrl}/auth/token`);
			request('post', options)
				.then(body => {
					resolve(getParams(body).access_token);
				})
				.catch(err => {
					reject(err);
				});
		});
	},

	getUser(token) {
		return new Promise((resolve, reject) => {
			const options = this.generateOptions(`${cfg.github.apiUrl}/user`, token);
			request('get', options)
				.then(user => {
					if (sourceOffline) {
						emit.sourceOffline(false);
						sourceOffline = false;
					}
					resolve(JSON.parse(user));
				})
				.catch(err => {
					console.log('error in user');
					sourceOffline = true;
					emit.sourceOffline(true);
					reject(err);
				});
		});
	},

	getRepos(user, token) {
		return new Promise((resolve, reject) => {
			const options = this.generateOptions(`${cfg.github.apiUrl}/users/${user.login}/repos`, token);
			request('get', options)
				.then(repos => {
					if (sourceOffline) {
						emit.sourceOffline(false);
						sourceOffline = false;
					}
					resolve(JSON.parse(repos));
				})
				.catch(err => {
					console.log('error in repos');
					sourceOffline = true;
					emit.sourceOffline(true);
					reject(err);
				});
		});
	},

	getCommits(repos, token) {
		return new Promise((resolve, reject) => {
			const dateLimit = util.getMonday(new Date().setDate(new Date().getDate() - 15));
			const commitsRequests = repos.map(repo => {
				const options = this.generateOptions(`${cfg.github.apiUrl}/repos/${repo.full_name}/commits?since=${dateLimit}`, token);
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
					if (sourceOffline) {
						emit.sourceOffline(false);
						sourceOffline = false;
					}
					resolve(commits);
				})
				.catch(err => {
					console.log('err in commits');
					sourceOffline = true;
					emit.sourceOffline(true);
					reject(err);
				});
		});
	},

	generateOptions(url, token) {
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
};