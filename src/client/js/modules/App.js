class App {
	constructor() {
		const Controller = require('./Controller.js');
		const View = require('./View.js');

		this.controller = new Controller(this);
		this.view = new View(this);
	}

	init() {
		this.bindElements();
		this.controller.init();
	}

	bindElements() {
		this.$option = document.getElementById('render-option');
		this.$form = document.getElementsByTagName('form')[0];
		this.$newUser = document.getElementById('new-user');
	}
}

module.exports = App;