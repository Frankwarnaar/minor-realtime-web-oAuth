class Controller {
	constructor(app) {
		this.app = app;
	}

	init() {
		this.socket();
		this.bindEvents();
	}

	socket() {
		const username = document.querySelector('[data-user]').getAttribute('[data-user]');
		const token = document.querySelector('[data-token]').getAttribute('[data-token]');
		this.app.socket = io();
		this.app.socket.username = username;
		this.app.socket.token = token;

		this.app.socket.emit('username', username);
		this.app.socket.emit('token', token);
	}
}

module.exports = Controller;