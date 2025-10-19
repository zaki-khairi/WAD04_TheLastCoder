
const { Op } = require('sequelize');
const db = require('../database'); 
const { User } = db;

/**
 * Buat user baru.
 * @param {{username:string,name:string,email:string,role:string}} payload
 * @param {{ transaction?: import('sequelize').Transaction }} [opts]
 */
async function create(payload, opts = {}) {
  // diasumsikan unique index di model (username, email)
  const user = await User.create(payload, { transaction: opts.transaction });
  return user.toJSON();
}

/** Ambil satu user by PK (id) */
async function findById(id) {
  const user = await User.findByPk(id);
  return user ? user.toJSON() : null;
}

async function findByUsername(username) {
  return await User.findOne({
    where: { username: { [Op.iLike]: String(username).trim() } },
    raw: true,
  });
}

async function findAll() {
  const rows = await User.findAll({ raw: true })
  return rows
}


/** Hapus user by id; return true jika ada yang terhapus */
async function deleteById(id, opts = {}) {
  const deleted = await User.destroy({ where: { id }, transaction: opts.transaction });
  return deleted > 0;
}

/** Cek duplikasi username/email */
async function existsUsernameOrEmail({ username, email }) {
  const found = await User.findOne({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: String(username) } },
        { email:    { [Op.iLike]: String(email) } },
      ],
    },
    attributes: ['id'],
  });
  return !!found;
}

module.exports = {
  create,
  findById,
  findByUsername,
  findAll,
  deleteById,
  existsUsernameOrEmail,
};