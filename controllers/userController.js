const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'users.json');

function getAllUsers(req, res, next) {
	fs.readFile(jsonPath, 'utf8', (err, raw) => {
		if (err) return next(err);

		let users = [];
		try {
			({ users =[] } = JSON.parse(raw));
		} catch (e) {
			return next(e);
		}

		const html = users.map(u => `
      <main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
        <p>Username: ${u.username}</p>
        <p>Name: ${u.name}</p>
        <p>Email: ${u.email}</p>
        <p>Role: ${u.role}</p>
      </main>
    `).join('');

		return res.send(html);
	});
}

async function getUserByUsername(req, res, next) {
	try {
		const usernameParam = String(req.params.username || '').toLowerCase();


		if (!usernameParam) {
			return res.status(400).json({ message: 'username param is required' });
		}

		fs.readFile(jsonPath, 'utf8', (err, raw) => {
			if (err) return next(err);
			const { users = [] } = JSON.parse(raw);

			const user = users.find(u => String(u.username || '').toLowerCase() === usernameParam);
			if (!user) return res.status(404).send('User not found');

			res.send(`
				<main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
					<p>Username: ${user.username}</p>
					<p>Name: ${user.name}</p>
					<p>Email: ${user.email}</p>
					<p>Role: ${user.role}</p>
				</main>
    `);
		});
	} catch (error) {
		next(error)
	}
}

function createUser(req, res, next) {
	const { username, name, email, role } = req.body || {};

	console.log("req", req)

	if (!username || !name || !email || !role) {
		return res.status(400).json({ message: 'username, name, email, dan role wajib diisi' });
	}

	const inputUsername = String(username).trim();
	const inputName = String(name).trim();
	const inputEmail = String(email).trim();
	const inputRole = String(role).trim();

	fs.readFile(jsonPath, 'utf-8', (readErr, raw) => {
		if (readErr) return next(readErr);

		let users = [];
		try {
			const parsed = JSON.parse(raw || '{}');
			users = Array.isArray(parsed.users) ? parsed.users : [];
		} catch (e) {
			return next(e);
		}

		// Cek duplikasi (case-insensitive untuk username & email)
		const exists = users.find(
			u =>
				String(u.username || '').toLowerCase() === inputUsername.toLowerCase() ||
				String(u.email || '').toLowerCase() === inputEmail.toLowerCase()
		);
		if (exists) {
			return res.status(409).json({ message: 'Username atau email sudah digunakan' });
		}

		const now = new Date().toISOString();

		const newUser = {
			username: inputUsername,
			name: inputName,
			email: inputEmail,
			role: inputRole,
			createdAt: now,
			updatedAt: now
		}

		// Tulis balik ke file
		const updated = { users: [...users, newUser] };
		fs.writeFile(jsonPath, JSON.stringify(updated, null, 2), 'utf-8', (writeErr) => {
			if (writeErr) return next(writeErr);

			// 201 Created
			res.status(201)
				.location(`/users/${encodeURIComponent(newUser.username)}`)
				.json(newUser);
		});
	});

}

module.exports = { 
	getUserByUsername, 
	getAllUsers,
	createUser
};