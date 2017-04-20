const request = require('request');

function makeRequest(method, options) {
	return new Promise((resolve, reject) => {
		request[method](options, (err, res, body) => {
			if (err) {
				reject(err);
			} else {
				resolve(body, res);
			}
		});
	});
}

module.exports = makeRequest;