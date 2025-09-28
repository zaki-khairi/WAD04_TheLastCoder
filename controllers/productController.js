const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '..', 'users.json');
const productsPath = path.join(__dirname, '..', 'products.json');

function createProduct(req, res, next) {
  const { product_name, product_category, price, owner } = req.body || {};

  const inputProductName = String(product_name || '').trim();
  const inputProductCategory = String(product_category || '').trim();
  const inputOwner = String(owner || '').trim();

  if (!inputProductName || !inputProductCategory || price == null || !inputOwner) {
    return res.status(400).json({
      message: 'product_name, product_category, price, dan owner wajib diisi'
    });
  }

  fs.readFile(usersPath, 'utf8', (uErr, uRaw) => {
    if (uErr) return next(uErr);

    let users = [];
    try {
      const parsed = JSON.parse(uRaw || '{}');
      users = Array.isArray(parsed.users) ? parsed.users : [];
    } catch (e) {
      return next(e);
    }

    // Cek owner ada & rolenya seller
    const ownerUser = users.find(
      u => String(u.username || '').toLowerCase() === inputOwner.toLowerCase()
    );
    if (!ownerUser) {
      return res.status(404).json({ message: '🤔 Username tidak ditemukan' });
    }
    if (String(ownerUser.role || '').toLowerCase() !== 'seller') {
      return res.status(403).json({ message: '🧐 Hanya seller yang boleh menambahkan products' });
    }

    fs.readFile(productsPath, 'utf8', (pErr, pRaw) => {
      let products = [];
      if (pErr) {
        if (pErr.code !== 'ENOENT') return next(pErr);
        // ENOENT -> file belum ada, biarkan products = []
      } else {
        try {
          const parsed = JSON.parse(pRaw || '{}');
          products = Array.isArray(parsed.products) ? parsed.products : [];

          // Cek duplikasi (case-insensitive untuk username & email)
          const exists = products.find(
            u =>
              String(u.product_name || '').toLowerCase() === inputProductName.toLowerCase()
          );
          if (exists) {
            return res.status(409).json({ message: '😅 Produk Name sudah ada' });
          }

        } catch (e) {
          return next(e);
        }
      }

      const now = new Date().toISOString();
      const newProduct = {
        product_name: inputProductName,
        product_category: inputProductCategory,
        price: Number(price),
        owner: ownerUser.username,
        createdAt: now,
        updatedAt: now
      };

      const updated = { products: [...products, newProduct] };
      fs.writeFile(productsPath, JSON.stringify(updated, null, 2), 'utf8', (wErr) => {
        if (wErr) return next(wErr);
        return res
          .status(201)
          .location(`/products/${encodeURIComponent(newProduct.id)}`)
          .json(newProduct);
      });
    });
  });
}

async function getProducts(req, res, next) {
  fs.readFile(productsPath, 'utf8', (uErr, uRaw) => {
    if (uErr) return next(uErr);

    let products = []
    try {
      ({ products =[] } = JSON.parse(uRaw));
    } catch (e) {
      return next(e);
    }

    const html = products.map(u => `
      <main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
        <p>Product Name: ${u.product_name}</p>
        <p>Product Category: ${u.product_category}</p>
        <p>Price: ${u.price}</p>
        <p>Owner: ${u.owner}</p>
      </main>
    `).join('');

    return res.send(html);
  })
}

async function getProductByProductName(req, res, next) {
  try {
    const productNameParam = String(req.params.product_name || '').toLowerCase();

    if (!productNameParam) {
      return res.status(400).json({ message: 'product_name param is required' });
    }

    fs.readFile(productsPath, 'utf8', (uErr, uRaw) => {
      if (uErr) return next(uErr);

      const { products = [] } = JSON.parse(uRaw);

			const product = products.find(u => String(u.product_name || '').toLowerCase() === productNameParam);
			if (!product) return res.status(404).send('User not found');

      return res.send(`
        <main style="font-family:system-ui; padding:24px; max-width:720px; margin:auto">
          <p>Product Name: ${product.product_name}</p>
          <p>Product Category: ${product.product_category}</p>
          <p>Price: ${product.price}</p>
          <p>Owner: ${product.owner}</p>
        </main>
      `);
    })

  } catch (error) {

  }
}

module.exports = {
  createProduct,
  getProducts,
  getProductByProductName
};