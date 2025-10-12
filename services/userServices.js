const { User } = require("../repositories/userRepositories")

function getAllUsers() {
    const users = User.findAll();

    return { success: true, data: users }
}

async function getUserByUsername(username) {
    const user = User.findByUsername(username)
    
    if(!user) {
        return { success: false, code: 404, message: "User tidak ditemukan"}
    }

    return { success: true, code: 200, data: user}
}

async function createUser(data) {
    const duplicate = User.existsUsernameOrEmail(data);

        if (!data.username || !data.name || !data.email || !data.role) {
		    return { success: false, code: 400, message: 'username, name, email, dan role wajib diisi' };
	    }

        if(duplicate) {
            return { success: false, code: 409, message: "Username atau email sudah digunakan"}
        }

        return { success: true, code: 200, data: User.createUser(data)}

}



module.exports = {
    getAllUsers,
    getUserByUsername,
    createUser
}
