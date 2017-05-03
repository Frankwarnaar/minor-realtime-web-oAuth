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
			.on('publishSourceStates', onPublishSourceStates.bind(this));

		function onConnect() {
			console.log('connected');
			this.app.connected = true;

			if (this.app.reconnectUnhandled) {
				this.app.reconnectUnhandled = false
				const options = {
					messages: {
						offline: 'Connection is lost to the server.',
						online: "You're reconnected to the server."
					},
					offline: false
				}
				this.app.view.renderDialog(options);
			}
		}

		function onDisconnect() {
			const app = this.app;
			app.connected = false;
			app.reconnectUnhandled = true;
			const options = {
				messages: {
					offline: 'Connection is lost to the server.',
					online: "You're reconnected to the server."
				},
				offline: true
			}
			app.view.renderDialog(options);

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

		function onPublishSourceStates(offline) {
			const options = {
				messages: {
					offline: 'GitHub failed to send live data.',
					online: "You're now receiving live data from GitHub again."
				},
				offline
			}
			this.view.renderDialog(options);
		}

	}

	emitOption() {
		const option = this.app.$option.value;
		this.app.socket.emit('registerUsers', option);
	}
}

module.exports = Controller;