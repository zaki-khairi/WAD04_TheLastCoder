const repo = require('../repositories/userRepositories');


async function getAllUsers() {
    const users = await repo.findAll();
    return { success: true, data: users }
}

async function getUserByUsername(username) {
  const user = await repo.findByUsername(username);
  if (!user) return { success: false, code: 404, message: 'User tidak ditemukan' };
  return { success: true, code: 200, data: user };  // user sudah plain
}

async function createUser(data) {
    if (!data.username || !data.name || !data.email || !data.role) {
        return { success: false, code: 400, message: 'username, name, email, role wajib diisi' };
    }

    if (await repo.existsUsernameOrEmail(data)) {
        return { success: false, code: 409, message: 'Username atau email sudah digunakan' };
    }

    const user = await repo.create(data);

    return { success: true, user };

}



module.exports = {
    getAllUsers,
    getUserByUsername,
    createUser
}
