// Source: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript#answer-3855394

const getParams = query => {
	if (!query) {
		return { };
	}

	return (/^[?#]/.test(query) ? query.slice(1) : query)
		.split('&')
		.reduce((params, param) => {
			const [key, value] = param.split('=');
			params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
			return params;
		}, { });
};

module.exports = getParams;