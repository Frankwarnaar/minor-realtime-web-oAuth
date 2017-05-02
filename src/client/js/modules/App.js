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
		this.$option = document.querySelector('#render-option');
	}
}

module.exports = App;