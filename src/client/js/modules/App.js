class App {
	constructor() {
		const Controller = require('./Controller.js');
		const View = require('./View.js');

		this.controller = new Controller(this);
		this.view = new View(this);

		this.$ = {
			usernameForm: document.getElementById('username-form'),
			usernameInput: document.querySelector('#username-form input[type="text"]'),
			chatsSection: document.getElementsByClassName('chats')[0],
			chatsList: document.getElementById('chats-list'),
			chatForm: document.querySelector('#chat-form'),
			chatFormInput: document.querySelector('#chat-form input[type="text"]')
		};
	}

	init() {
		this.controller.init();
	}
}

module.exports = App;