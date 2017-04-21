class View {
	constructor(app) {
		this.app = app;
	}

	renderUsers(users) {
		const $tableBody = document.querySelector('#ranking tbody');

		let content = '';
		users.forEach((user, i) => {
			content += `
				<tr>
					<td>${i + 1}</td>
					<td>${user.name}</td>
					<td>${user.commits}</td>
				</tr>`;
		});

		$tableBody.innerHTML = content;
	}
}

module.exports = View;