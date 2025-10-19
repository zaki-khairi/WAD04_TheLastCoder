const { Op } = require('sequelize');
const db = require('../database'); 
const { Product } = db;

/**
 * Buat user baru.
 * @param {{product_name:string,product_category:string,price:integer,owner:string}} payload
 * @param {{ transaction?: import('sequelize').Transaction }} [opts]
 */
async function create(payload, opts = {}) {
  const product = await Product.create(payload, { transaction: opts.transaction });
  return product.toJSON();
}

/** Ambil satu user by PK (id) */
async function findById(id) {
  const product = await Product.findByPk(id);
  return product ? product.toJSON() : null;
}

async function findByProductName(name) {
  return await Product.findOne({
    where: { product_name: { [Op.iLike]: String(name).trim() } },
    attributes: ['id','product_name','price'],
    raw: true,
  });
}

async function findAll() {
  const rows = await Product.findAll({ raw: true })
  return rows
}

/** Hapus user by id; return true jika ada yang terhapus */
async function deleteById(id, opts = {}) {
  const deleted = await Product.destroy({ where: { id }, transaction: opts.transaction });
  return deleted > 0;
}


module.exports = { 
  create,
  findById,
  findByProductName,
  findAll,
  deleteById,
};
