class View {
	constructor(app) {
		this.app = app;
	}

	renderUsers() {
		const $tableBody = document.querySelector('#ranking tbody');
		const option = this.app.$option.value;
		let users = this.app.users;

		if (users.length > 0) {
			users = users.sort((a, b) => {
				return b.score - a.score;
			});
		}

		let content = '';
		users.forEach((user, i) => {
			content += `
				<tr>
					<td>${i + 1}</td>
					<td>${user.name || user.login}</td>
					<td>${user.score !== null ? user.score : '<div class="loader"></div>'}</td>
				</tr>`;
		});

		$tableBody.innerHTML = content;
	}

	renderDialog(options) {
		const $body = document.getElementsByTagName('body')[0];
		let $dialog = document.getElementsByClassName('dialog')[0];

		if ($dialog) {
			$dialog.innerHTML = `<p>${options.messages.online}</p>`;
		} else {
			$dialog = document.createElement('dialog');
			$dialog.innerHTML = `<p>${options.messages.offline}</p>`;
			$body.appendChild($dialog);
		}
		$dialog.setAttribute('open', true);
		$dialog.className = `dialog ${options.offline ? 'error' : 'success'}`;

		setTimeout(() => {
			$dialog.removeAttribute('open');
		}, 5000);
	}
}

module.exports = View;