require('dotenv').config();

module.exports = {
	app: {
		name: 'rwt-oAuth',
		baseUrl: process.env.APP_BASEURL
	},
	github: {
		oAuthUrl: 'https://github.com/login/oauth',
		apiUrl: 'https://api.github.com',
		clientId: process.env.GITHUB_CLIENT,
		secret: process.env.GITHUB_SECRET
	}
};
