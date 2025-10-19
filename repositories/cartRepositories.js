// repositories/cartRepository.js
const db = require('../database');
const { Cart, CartItem, Product } = db;

async function getOrCreateCartByUserId(userId, tx) {
  let cart = await Cart.findOne({ where: { user_id: userId }, transaction: tx });
  if (!cart) cart = await Cart.create({ user_id: userId }, { transaction: tx });
  return cart;
}

async function upsertItem(cartId, productId, qty, tx) {
  const [item, created] = await CartItem.findOrCreate({
    where: { cart_id: cartId, product_id: productId },
    defaults: { qty },
    transaction: tx,
  });
  if (!created) {
    item.qty += qty;
    await item.save({ transaction: tx });
  }
  return item;
}

async function removeOneItem(cartId, productId, tx) {
  const item = await CartItem.findOne({ where: { cart_id: cartId, product_id: productId }, transaction: tx });
  if (!item) return false;
  if (item.qty > 1) { item.qty -= 1; await item.save({ transaction: tx }); }
  else { await item.destroy({ transaction: tx }); }
  return true;
}

async function getCartViewByUserId(userId) {
  const cart = await Cart.findOne({
    where: { user_id: userId },
    include: [{
      model: CartItem,
      attributes: ['qty'],
      include: [{ model: Product, attributes: ['product_name','price'] }]
    }]
  });

  if (!cart) return { product_details: [], total_price: 0 };

  const details = cart.CartItems.map(ci => ({
    product_name: ci.Product.product_name,
    price: Number(ci.Product.price),
    qty: ci.qty,
  }));
  const total = details.reduce((s,d)=> s + d.price * d.qty, 0);

  return { product_details: details, total_price: total };
}

module.exports = { getOrCreateCartByUserId, upsertItem, removeOneItem, getCartViewByUserId };