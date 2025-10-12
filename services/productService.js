const { Product } = require("../repositories/productRepositories");
const { User } = require("../repositories/userRepositories");

function getAllProducts() {
    const products = Product.findAll();

    return { success: true, code: 200, data: products }
}

async function getProductByProductName(name) {
    const product = Product.findByProductName(name)

    if (!product) {
        return { success: false, code: 404, message: "Product tidak ditemukan" }
    }

    return { success: true, code: 200, data: product }
}

async function createProduct(data) {
    const owner = User.findByUsername(data.owner)

    if (!data.product_name || !data.product_category || !data.price || !data.owner) {
        return { success: false, code: 400, message: 'product_name, product_category, price, dan owner wajib diisi' };
    }

    if(!owner) {
        return { success: false, code: 404, message: "Owner tidak ditemukan"}
    }

    if(owner && owner.role !== "seller") {
        return { success: false, code: 403, message: "Hanya seller yang boleh menambahkan products"}
    }

    return { success: true, code: 200, data: Product.createProduct(data) }

}



module.exports = {
    getAllProducts,
    getProductByProductName,
    createProduct
}
