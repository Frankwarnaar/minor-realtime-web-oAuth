class View {
	constructor(app) {
		this.app = app;
	}

	renderUsers() {
		const $tableBody = document.querySelector('#ranking tbody');
		const option = document.querySelector('#render-option').value;
		let users = this.app.users;

		users = this.app.users.sort((a, b) => {
			return b.scores[option] - a.scores[option];
		});

		let content = '';
		users.forEach((user, i) => {
			console.log(user.scores[option], user.scores, option);
			content += `
				<tr>
					<td>${i + 1}</td>
					<td>${user.name}</td>
					<td>${user.scores[option]}</td>
				</tr>`;
		});

		$tableBody.innerHTML = content;
	}
}

module.exports = View;