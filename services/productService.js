const productRepo = require("../repositories/productRepositories");
const userRepo = require('../repositories/userRepositories');

async function getAllProducts() {
    const products = await productRepo.findAll();

    return { success: true, code: 200, data: products }
}

async function getProductByProductName(name) {
    const product = await productRepo.findByProductName(name)

    if (!product) {
        return { success: false, code: 404, message: "Product tidak ditemukan" }
    }

    return { success: true, code: 200, data: product }
}

async function createProduct(data) {
    const owner = await userRepo.findByUsername(data.owner)
    console.log("owner: ", owner)
    if (!data.product_name || !data.product_category || !data.price || !data.owner) {
        return { success: false, code: 400, message: 'product_name, product_category, price, dan owner wajib diisi' };
    }

    if(!owner) {
        return { success: false, code: 404, message: "Owner tidak ditemukan"}
    }

    if(owner && owner.role !== "seller") {
        return { success: false, code: 403, message: "Hanya seller yang boleh menambahkan products"}
    }

    const product = await productRepo.create(data)

    return { success: true, product}

}



module.exports = {
    getAllProducts,
    getProductByProductName,
    createProduct
}
