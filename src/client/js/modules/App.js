class App {
	constructor() {
		const Controller = require('./Controller.js');
		const View = require('./View.js');

		this.controller = new Controller(this);
		this.view = new View(this);
	}

	init() {
		this.controller.init();
	}
}

module.exports = App;