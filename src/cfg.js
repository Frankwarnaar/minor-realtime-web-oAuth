require('dotenv').config();

module.exports = {
	app: {
		baseUrl: 'http://localhost:3000'
	},
	github: {
		oAuthUrl: 'https://github.com/login/oauth',
		clientId: process.env.GITHUB_CLIENT,
		secret: process.env.GITHUB_SECRET
	}
};
