class View {
	constructor(app) {
		this.app = app;
	}

	renderUsers() {
		const $tableBody = document.querySelector('#ranking tbody');
		const option = this.app.$option.value;
		let users = this.app.users;

		if (users.length > 0) {
			users = this.app.users.sort((a, b) => {
				if (a.scores[option] && b.scores[option]) {
					return b.scores[option] - a.scores[option];
				}
				return 0;
			});
		}

		let content = '';
		users.forEach((user, i) => {
			content += `
				<tr>
					<td>${i + 1}</td>
					<td>${user.name}</td>
					<td>${user.score !== null ? user.score : '<div class="loader"></div>'}</td>
				</tr>`;
		});

		$tableBody.innerHTML = content;
	}

	renderSourceState(offline) {
		const $body = document.getElementsByTagName('body')[0];
		let $dialog = document.getElementsByClassName('source-state')[0];

		if ($dialog) {
			$dialog.innerHTML = "<p>You're now receiving live data from GitHub again.</p>";
		} else {
			$dialog = document.createElement('$dialog');
			$dialog.innerHTML = "<p>GitHub failed to send live data.";
			$body.appendChild($dialog);
		}
		$dialog.setAttribute('open', true);
		$dialog.className = `source-state ${offline ? 'error' : 'success'}`;

		setTimeout(() => {
			$dialog.setAttribute('open', false);
		});
	}


	renderConnectionStatus(online) {
		const $body = document.getElementsByTagName('body')[0];
		let $dialog = document.getElementsByClassName('connection-state')[0];

		if ($dialog) {
			$dialog.innerHTML = "<p>You're reconnected to the server.</p>";
		} else {
			$dialog = document.createElement('dialog');
			$dialog.innerHTML = "<p>Connection is lost to the server.</p>";
			$body.appendChild($dialog);
		}
		$dialog.setAttribute('open', true);
		$dialog.className = `connection-state ${online ? 'error' : 'success'}`;

		setTimeout(() => {
			$dialog.setAttribute('open', false);
		});
	}
}

module.exports = View;