class Controller {
	constructor(app) {
		this.app = app;
	}

	init() {
		this.socket();
		this.bindEvents();
	}

	bindEvents() {
		this.app.$option.addEventListener('input', this.app.view.renderUsers.bind(this));
		this.app.$option.addEventListener('input', this.emitOption.bind(this));
	}

	socket() {
		const name = document.querySelector('[data-user]').getAttribute('data-user');
		const login = document.querySelector('[data-login]').getAttribute('data-login');
		const token = document.querySelector('[data-token]').getAttribute('data-token');
		const option = this.app.$option.value;

		this.app.socket = io();
		this.app.socket.name = name;
		this.app.socket.login = login;
		this.app.socket.token = token;
		this.app.socket.option = option;
		this.app.socket.emit('publishUser', {
			name,
			login,
			token,
			option
		});

		this.app.socket
			.on('publishUsers', users => {
				this.app.users = users;
				this.app.view.renderUsers();
			});
	}

	emitOption() {
		const option = this.app.$option.value;
		this.app.socket.emit('registerUsers', option);
	}
}

module.exports = Controller;