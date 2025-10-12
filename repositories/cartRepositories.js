const fs = require('fs');
const path = require('path');
const { Product } = require('./productRepositories');

const cartsPath = path.resolve(__dirname, '..', 'carts.json');

function readCartsFile() {
  const raw = fs.readFileSync(cartsPath, 'utf8');
  const { carts = [] } = JSON.parse(raw || '{}');
  return carts;

}

function writeCartsFile(carts) {
  const payload = JSON.stringify({ carts }, null, 2);
  fs.writeFileSync(cartsPath, payload, 'utf8');
}

// --- Entity ---
class Cart {
  constructor({ username, product_details, total_price, createdAt, updatedAt }) {
    this.username = username;
    this.product_details = product_details ?? [];
    this.total_price = Number(total_price ?? 0);
    this.createdAt = createdAt ?? new Date().toISOString();
    this.updatedAt = updatedAt ?? new Date().toISOString();
  }

  static findAll() {
    return readCartsFile().map((p) => new Cart(p));
  }

  static findCartbyUsername(name) {
    const username = String(name).toLowerCase();

    const data = readCartsFile().find(
      (c) => String(c.username).toLowerCase() === username
    );
    return data ? new Cart(data) : null;
  }

  static computeTotal(details = []) {
    return details.reduce((sum, it) => sum + Number(it.price || 0), 0);
  }

  static addtoCart({ username, product_name }) {
    const itemPrice = Product.getPriceByName(product_name);
    let cart = carts.find(c => String(c.username || '').toLowerCase() === username.toLowerCase());

    const carts = readCartsFile();
    const now = new Date().toISOString();

    if (!cart) {
      cart = new Cart({
        username: uname,
        product_details: [{ product_name: pname, price: itemPrice }],
        total_price: itemPrice,
        createdAt: now,
        updatedAt: now
      });
      carts.push(cart);
    } else {
      const details = Array.isArray(cart.product_details) ? cart.product_details : [];
      details.push({ product_name: pname, price: itemPrice });
      cart.product_details = details;
      cart.total_price = Cart.computeTotal(details);   // <<< total dari price yang berasal dari Product repo
      cart.updatedAt = now;
    }

    writeCartsFile(carts);
    return new Cart(cart);
  }

  static remoteToCart({ username, product_name }) {
    const carts = readCartsFile();
    const uname = String(username).toLowerCase();
    const idx = carts.findIndex(c => String(c.username || '').toLowerCase() === uname);
    const details = Array.isArray(carts[idx].product_details) ? carts[idx].product_details : [];
    const dIdx = details.findIndex(d => String(d.product_name || '').toLowerCase() === String(product_name).toLowerCase());

    details.splice(dIdx, 1);
    carts[idx].product_details = details;
    carts[idx].total_price = Cart.computeTotal(details); // total dihitung ulang
    carts[idx].updatedAt = new Date().toISOString();

    writeCartsFile(carts);
    return new Cart(carts[idx]);
  }
}

module.exports = { Cart };
