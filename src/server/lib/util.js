module.exports = {
	findMatchingUser(users, login) {
		return users.find(user => {
			return user.login === login;
		});
	},
	getPublicUsers(users, option) {
		users = users.filter(user => {
			return user.login.length > 0;
		});
		return users.map(user => {
			return {
				name: user.name,
				login: user.login,
				active: user.active,
				score: user.scores ? user.scores[option] : null
			};
		});
	},
	getMonday(d) {
		d = new Date(d);
		const day = d.getDay();
		const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	}
};