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
					<td>${user.scores ? user.scores[option] : 0}</td>
				</tr>`;
		});

		$tableBody.innerHTML = content;
	}
}

module.exports = View;