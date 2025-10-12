const { Cart } = require("../repositories/cartRepositories");

function getAllCarts() {
    const carts = Cart.findAll();

    return { success: true, code: 200, data: carts }
}

async function getCartByUsername(name) {
    const cart = Cart.findCartbyUsername(name)

    if (!cart) {
        return { success: false, code: 404, message: "Product tidak ditemukan" }
    }

    return { success: true, code: 200, data: cart }
}

async function addToCart(data) {
    const cartOwner = Cart.findCartbyUsername(data.username)

    if (!data.username || !data.productname) {
        return { success: false, code: 400, message: 'username dan product_name wajib diisi' };
    }

    if(cartOwner && cartOwner.role !== "buyer") {
        return { success: false, code: 403, message: "Hanya buyer yang boleh menambahkan carts"}
    }

    return { success: true, code: 200, data: Cart.addtoCart(data) }

}

async function removeToCart(data) {
    const cartOwner = Cart.findCartbyUsername(data.username)

    if (!data.username || !data.productname) {
        return { success: false, code: 400, message: 'username dan product_name wajib diisi' };
    }

    if(cartOwner && cartOwner.role !== "buyer") {
        return { success: false, code: 403, message: "Hanya buyer yang boleh mengurangi carts"}
    }

    return { success: true, code: 200, data: Cart.remoteToCart(data) }

}

module.exports = {
    getAllCarts,
    getCartByUsername,
    addToCart,
    removeToCart
}
