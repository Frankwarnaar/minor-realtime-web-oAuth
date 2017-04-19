const express = require('express');

const cfg = require('./../../cfg.js');

const router = express.Router()
	.get('/', getAuth);

function getAuth(req, res) {
	res.redirect(`${cfg.github.oAuthUrl}/authorize?cliend_id=${cfg.github.clientId}&redirect_uri=${cfg.app.baseUrl}/auth&scope=public_repo`);
}

module.exports = router;