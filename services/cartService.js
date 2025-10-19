// services/cartService.js
const db = require('../database');
const userRepo = require('../repositories/userRepositories');
const prodRepo = require('../repositories/productRepositories');
const cartRepo = require('../repositories/cartRepositories');

async function addToCart({ username, product_name, qty = 1 }) {
  if (!username || !product_name) return { success:false, code:400, message:'username & product_name wajib' };
  qty = Number(qty) || 1;

  const user = await userRepo.findByUsername(username);
  if (!user) return { success:false, code:404, message:'User tidak ditemukan' };
  if (String(user.role).toLowerCase() !== 'buyer') {
    return { success:false, code:403, message:'Hanya buyer yang boleh menambahkan cart' };
  }

  const product = await prodRepo.findByProductName(product_name);
  if (!product) return { success:false, code:404, message:'Produk tidak ditemukan' };

  const result = await db.sequelize.transaction(async (tx) => {
    const cart = await cartRepo.getOrCreateCartByUserId(user.id, tx);
    await cartRepo.upsertItem(cart.id, product.id, qty, tx);
    return { success:true, code:200, cart_id: cart.id };
  });
  return result;
}

async function removeFromCart({ username, product_name }) {
  if (!username || !product_name) return { success:false, code:400, message:'username & product_name wajib' };

  const user = await userRepo.findByUsername(username);
  if (!user) return { success:false, code:404, message:'User tidak ditemukan' };

  const product = await prodRepo.findByProductName(product_name);
  if (!product) return { success:false, code:404, message:'Produk tidak ditemukan' };

  const result = await db.sequelize.transaction(async (tx) => {
    const cart = await cartRepo.getOrCreateCartByUserId(user.id, tx);
    const ok = await cartRepo.removeOneItem(cart.id, product.id, tx);
    if (!ok) return { success:false, code:404, message:'Produk tidak ada di cart' };
    return { success:true, code:200 };
  });
  return result;
}

async function getCartByUsername(username) {
  const user = await userRepo.findByUsername(username);
  if (!user) return { success:false, code:404, message:'User tidak ditemukan' };

  const view = await cartRepo.getCartViewByUserId(user.id);
  return {
    success: true, code: 200,
    data: {
      username: user.username,
      product_details: view.product_details,
      total_price: view.total_price
    }
  };
}

module.exports = { addToCart, removeFromCart, getCartByUsername };
