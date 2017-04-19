const express = require('express');

const router = express.Router()
	.get('/', getIndex);

function getIndex(req, res) {
	res.render('index');
}

module.exports = router;