class View {
	constructor(app) {
		this.app = app;
	}

	renderMessage(message) {
		const listItem = document.createElement('li');
		message.date = new Date(message.timestamp).toLocaleString();
		const content = `
			<header>
				${message.sender} - ${message.date}
			</header>
			<p>${message.message}</p>
		`;
		listItem.setAttribute('data-message', message.sender === this.app.username ? 'send' : 'received');
		listItem.innerHTML = content;
		listItem.classList.add('chat');
		this.app.$.chatsList.appendChild(listItem);
	}

	showEl($el, show) {
		show ? $el.classList.remove('hidden') : $el.classList.add('hidden');
	}
}

module.exports = View;