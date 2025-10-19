const svc = require('../services/cartService');

function listCarts(req, res, next) {
  try {
    const allCarts = getAllCarts();
    res.status(200).json(allCarts);
  } catch (error) {
    next(error)
  }
}

async function listCartByUsername(req, res, next) {
  try {
    const r = await svc.getCartByUsername(req.params.username);
    if (!r.success) return res.status(r.code).json({ message: r.message });
    return res.status(200).json(r.data);

  } catch (error) {
    next(error)
  }
}

async function addCart(req, res, next) {	
	try {
		const r = await svc.addToCart({
      username: req.params.username,
      product_name: req.body.product_name,
      qty: req.body.qty
    });
    if (!r.success) return res.status(r.code).json({ message: r.message });
    return res.status(200).json({ message: 'Added', cart_id: r.cart_id });

	} catch (error) {
		next(error)	
	}
}

async function removeCart(req, res, next) {	
	try {
		const r = await svc.removeFromCart({
      username: req.params.username,
      product_name: req.body.product_name
    });
    if (!r.success) return res.status(r.code).json({ message: r.message });
    return res.status(200).json({ message: 'Removed' });
	} catch (error) {
		next(error)	
	}
}

module.exports = {
  listCarts,
  listCartByUsername,
  addCart,
  removeCart
};