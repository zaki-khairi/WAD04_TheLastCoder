const svc = require('../services/userServices');

async function listUsers(req, res, next) {
  try {
    const r = await svc.getAllUsers();  

    return res.status(200).json(r);
  } catch (error) {
    next(error);
  }
}

async function listUserByUsername(req, res, next) {
  try {
    const r = await svc.getUserByUsername(req.params.username);

    if (!r.success) {
      return res.status(r.code).json({ message: r.message });
    }

    return res.status(200).json(r.data);
  } catch (error) {
    next(error);
  }
}

async function newUser(req, res, next) {
  try {
    const r = await svc.createUser(req.body);
    if (!r.success) {
      return res.status(r.code || 400).json({ message: r.message });
    }
    return res.status(201).json(r.user);
  } catch (e) {
    next(e);
  }
}

module.exports = {
  listUsers,
  listUserByUsername,
  newUser,
};
