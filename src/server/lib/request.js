const request = require('request');

function makeRequest(method, url) {
	return new Promise((resolve, reject) => {
		request[method](url, (err, res, body) => {
			if (err) {
				reject(err);
			} else {
				resolve(body, res);
			}
		});
	});
}

module.exports = makeRequest;