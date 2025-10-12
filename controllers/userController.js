const { getAllUsers, getUserByUsername, createUser } = require('../services/userServices');

function listUsers(req, res, next) {
	try{
		const allUsers = getAllUsers();
		res.status(200).json(allUsers);
	} catch (error) {
		next(error)
	}
}

async function listUserByUsername(req, res, next) {
	try {
		const result = await getUserByUsername(req.params.username)
		
		if(!result.success) {
			res.status(result.code).json(result.message)
		} 

		res.status(200).json(result)
	
	} catch (error) {
		next(error)
	}
}

async function newUser(req, res, next) {	
	try {
		const result = await createUser(req.body)

		if(!result.success) {
			res.status(result.code).json(result.message)
		}
		
		res.status(200).json(result)
	} catch (error) {
		next(error)	
	}
}

module.exports = { 
	listUserByUsername, 
	listUsers,
	newUser
};