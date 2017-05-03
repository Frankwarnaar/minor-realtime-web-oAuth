const util = require('./util.js');

module.exports = {
	sockets: [],
	users(sockets, users) {
		sockets.forEach(socket => {
			this.usersToSingle(users, socket);
		});
	},
	usersToSingle(users, socket) {
		const publicUsers = util.getPublicUsers(users, socket.user.option);
		socket.emit('publishUsers', publicUsers);
	},
	sourceOffline(offline) {
		if (Array.isArray(this.sockets)) {
			this.sockets.forEach(socket => {
				console.log(socket.id);
				socket.emit('publishSourceState', offline);
			});
		}
	}
};