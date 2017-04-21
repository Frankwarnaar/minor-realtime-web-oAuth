class Controller {
	constructor(app) {
		this.app = app;
	}

	init() {
		this.socket();
	}

	socket() {
		const name = document.querySelector('[data-user]').getAttribute('data-user');
		const login = document.querySelector('[data-login]').getAttribute('data-login');
		const token = document.querySelector('[data-token]').getAttribute('data-token');
		this.app.socket = io();
		this.app.socket.name = name;
		this.app.socket.login = login;
		this.app.socket.token = token;
		this.app.socket.emit('setUser', {
			name,
			login,
			token
		});

		this.app.socket
			.on('userRegistration', users => {
				console.log(users);
			});
	}
}

module.exports = Controller;