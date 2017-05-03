module.exports = {
	findMatchingUser(users, login) {
		return users.find(user => {
			return user.login === login;
		});
	},
	getPublicUsers(users, option) {
		users = users.filter(user => {
			return user.name.length > 0;
		});
		return users.map(user => {
			return {
				name: user.name,
				login: user.login,
				active: user.active,
				score: user.scores ? user.scores[option] : null
			};
		});
	}
}