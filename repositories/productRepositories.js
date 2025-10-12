const fs = require('fs');
const path = require('path');

const productsPath = path.resolve(__dirname, '..', 'products.json');

function readProductsFile() {
  const raw = fs.readFileSync(productsPath, 'utf8');
  const { products = [] } = JSON.parse(raw || '{}');
  return products;

}

function writeProductsFile(products) {
  const payload = JSON.stringify({ products }, null, 2);
  fs.writeFileSync(productsPath, payload, 'utf8');
}

// --- Entity ---
class Product {
  constructor({ product_name, product_category, price, owner, createdAt, updatedAt }) {
    this.product_name = product_name;
    this.product_category = product_category,
      this.price = price,
      this.owner = owner,
      this.createdAt = createdAt ?? new Date().toISOString();
    this.updatedAt = updatedAt ?? new Date().toISOString();
  }

  static findAll() {
    return readProductsFile().map((p) => new Product(p));
  }

  static findByProductName(name) {
    const productName = String(name).toLowerCase();

    const data = readProductsFile().find(
      (p) => String(p.product_name).toLowerCase() === productName
    );
    return data ? new Product(data) : null;
  }

  static getPriceByName(name) {
    const p = Product.findByName(name);
    return p && p.price != null ? Number(p.price) : null;
  }

  static createProduct({ product_name, product_category, price, owner }) {
    const products = readProductsFile();
    const now = new Date().toISOString();
    const product = new Product({
      product_name: String(product_name).trim(),
      product_category: String(product_category).trim(),
      price: String(price).trim(),
      owner: String(owner).trim(),
      createdAt: now,
      updatedAt: now,
    });
    writeProductsFile([...products, product]);
    return product;
  }
}

module.exports = { Product };
