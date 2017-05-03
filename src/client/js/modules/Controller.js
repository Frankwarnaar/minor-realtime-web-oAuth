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
			.on('connect', onConnect.bind(this))
			.on('disconnect', onDisconnect.bind(this))
			.on('publishUsers', onPublishUsers.bind(this))
			.on('publishSourceState', this.app.view.renderSourceState.bind(this));

		function onConnect() {
			console.log('connected');
			this.app.connected = true;

			if (this.app.reconnectUnhandled) {
				this.app.reconnectUnhandled = false
				this.app.view.renderConnectionStatus(true);
			}
		}

		function onDisconnect() {
			const app = this.app;
			app.connected = false;
			app.reconnectUnhandled = true;
			app.view.renderConnectionStatus(false);

			let interval = 1000
			reconnect();

			function reconnect() {
				setTimeout(() => {
					app.socket = io();
					if (!app.connected) {
						interval = interval * 2;
						reconnect();
					}
					console.log('reconnecting');
				}, interval);
			}
		}

		function onPublishUsers(users) {
			this.app.users = users;
			this.app.view.renderUsers();
		}

	}

	emitOption() {
		const option = this.app.$option.value;
		this.app.socket.emit('registerUsers', option);
	}
}

module.exports = Controller;