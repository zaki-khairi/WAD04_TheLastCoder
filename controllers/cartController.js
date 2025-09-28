const fs = require('fs');
const path = require('path');

const usersPath    = path.join(__dirname, '..', 'users.json');
const productsPath = path.join(__dirname, '..', 'products.json');
const cartsPath    = path.join(__dirname, '..', 'carts.json');


function readJson(filePath, defaultValue, cb) {
  fs.readFile(filePath, 'utf8', (err, raw) => {
    if (err) {
      if (err.code === 'ENOENT') return cb(null, defaultValue);
      return cb(err);
    }
    try { cb(null, raw ? JSON.parse(raw) : defaultValue); }
    catch (e) { cb(e); }
  });
}

// cek user buyer
function requireBuyer(username, cb) {
  readJson(usersPath, { users: [] }, (err, data) => {
    if (err) return cb(err);
    const user = (data.users || []).find(
      u => String(u.username || '').toLowerCase() === String(username).toLowerCase()
    );
    if (!user) return cb({ status: 404, message: 'User tidak ditemukan' });
    if (String(user.role || '').toLowerCase() !== 'buyer') {
      return cb({ status: 403, message: 'Hanya buyer yang boleh mengelola shopping cart' });
    }
    cb(null, user);
  });
}

function getCartByUsername(req, res, next) {
  const username = String(req.params.username || '').trim();
  if (!username) return res.status(400).json({ message: 'username param wajib diisi' });

 
  readJson(usersPath, { users: [] }, (uErr, uData) => {
    if (uErr) return next(uErr);
    const exists = (uData.users || []).some(
      u => String(u.username || '').toLowerCase() === username.toLowerCase()
    );
    if (!exists) return res.status(404).json({ message: 'User tidak ditemukan' });

    readJson(cartsPath, { carts: [] }, (cErr, cData) => {
      if (cErr) return next(cErr);
      const cart = (cData.carts || []).find(
        c => String(c.username || '').toLowerCase() === username.toLowerCase()
      ) || { username, product_details: [] };
      return res.json(cart);
    });
  });
}

// - Jika total_price tidak dikirim, akan dicoba ambil dari products.json
function addToCart(req, res, next) {
  const username = String(req.params.username || '').trim();
  const { product_name, total_price } = req.body || {};
  if (!username || !product_name) {
    return res.status(400).json({ message: 'username param dan product_name wajib diisi' });
  }

  requireBuyer(username, (roleErr) => {
    if (roleErr) {
      const code = roleErr.status || 500;
      return res.status(code).json({ message: roleErr.message || 'Role check error' });
    }

    // cari harga (kalau tidak disediakan)
    const ensurePrice = (cb) => {
      if (total_price != null) return cb(null, Number(total_price));
      readJson(productsPath, { products: [] }, (pErr, pData) => {
        if (pErr) return cb(pErr);
        const prod = (pData.products || []).find(
          p => String(p.product_name || '').toLowerCase() === String(product_name).toLowerCase()
        );
        if (!prod || prod.price == null) {
          return cb({ status: 404, message: 'Produk tidak ditemukan atau tidak punya harga' });
        }
        cb(null, Number(prod.price));
      });
    };

    ensurePrice((priceErr, priceVal) => {
      if (priceErr) {
        const code = priceErr.status || 500;
        return res.status(code).json({ message: priceErr.message || 'Gagal mendapatkan harga' });
      }

      readJson(cartsPath, { carts: [] }, (cErr, cData) => {
        if (cErr) return next(cErr);
        const carts = Array.isArray(cData.carts) ? cData.carts : [];

        // satu buyer = satu cart
        let cart = carts.find(
          c => String(c.username || '').toLowerCase() === username.toLowerCase()
        );
        if (!cart) {
          cart = { username, product_details: [] };
          carts.push(cart);
        }

        // apakah item sudah ada? kalau ya tambahkan total_price (atau timpa—pilih kebijakan)
        const existing = cart.product_details.find(
          i => String(i.product_name || '').toLowerCase() === String(product_name).toLowerCase()
        );
        if (existing) {
          existing.total_price = Number(existing.total_price || 0) + Number(priceVal);
        } else {
          cart.product_details.push({
            product_name,
            total_price: Number(priceVal)
          });
        }

        fs.writeFile(
          cartsPath,
          JSON.stringify({ carts }, null, 2),
          'utf8',
          (wErr) => {
            if (wErr) return next(wErr);
            return res.status(201).json(cart);
          }
        );
      });
    });
  });
}

function removeFromCart(req, res, next) {
  const username = String(req.params.username || '').trim();
  const { product_name } = req.body || {};
  if (!username || !product_name) {
    return res.status(400).json({ message: 'username param dan product_name wajib diisi' });
  }

  requireBuyer(username, (roleErr) => {
    if (roleErr) {
      const code = roleErr.status || 500;
      return res.status(code).json({ message: roleErr.message || 'Role check error' });
    }

    readJson(cartsPath, { carts: [] }, (cErr, cData) => {
      if (cErr) return next(cErr);
      const carts = Array.isArray(cData.carts) ? cData.carts : [];

      const idx = carts.findIndex(
        c => String(c.username || '').toLowerCase() === username.toLowerCase()
      );
      if (idx === -1) {
        return res.status(404).json({ message: 'Cart tidak ditemukan' });
      }

      const before = carts[idx].product_details.length;
      carts[idx].product_details = carts[idx].product_details.filter(
        i => String(i.product_name || '').toLowerCase() !== String(product_name).toLowerCase()
      );
      const after = carts[idx].product_details.length;

      if (before === after) {
        return res.status(404).json({ message: 'Produk tidak ada di cart' });
      }

      fs.writeFile(
        cartsPath,
        JSON.stringify({ carts }, null, 2),
        'utf8',
        (wErr) => {
          if (wErr) return next(wErr);
          return res.json(carts[idx]);
        }
      );
    });
  });
}

module.exports = {
  getCartByUsername,
  addToCart,
  removeFromCart
};
