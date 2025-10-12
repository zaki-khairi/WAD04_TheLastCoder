const { getAllCarts, getCartByUsername, addToCart, removeToCart } = require('../services/cartService');

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
    const result = await getCartByUsername(req.params.username)

    if (!result.success) {
      res.status(result.code).json(result.message)
    }

    res.status(200).json(result)

  } catch (error) {
    next(error)
  }
}

async function addCart(req, res, next) {	
	try {
		const result = await addToCart(req.body)

		if(!result.success) {
			res.status(result.code).json(result.message)
		} 
			
    res.status(200).json(result)
	} catch (error) {
		next(error)	
	}
}

async function removeCart(req, res, next) {	
	try {
		const result = await removeToCart(req.body)

		if(!result.success) {
			res.status(result.code).json(result.message)
		} 
			
    res.status(200).json(result)
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