class View {
	constructor(app) {
		this.app = app;
	}

	renderUsers(users) {
		console.log(users);
		const $tableBody = document.querySelector('#ranking tbody');

		let content = '';
		users.forEach(user => {
			content += `
				<tr>
					<td>${user.name}</td>
					<td>${user.commits}</td>
				</tr>`;
		});

		$tableBody.innerHTML = content;
	}
}

module.exports = View;