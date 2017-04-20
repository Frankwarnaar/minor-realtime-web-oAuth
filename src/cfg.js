require('dotenv').config();

module.exports = {
	app: {
		name: 'rwt-oAuth',
		baseUrl: 'http://localhost:3000'
	},
	github: {
		oAuthUrl: 'https://github.com/login/oauth',
		apiUrl: 'https://api.github.com',
		clientId: process.env.GITHUB_CLIENT,
		secret: process.env.GITHUB_SECRET
	}
};
