const svc = require('../services/productService');

async function listProducts(req, res, next) {
  try {
    const allProducts = await svc.getAllProducts();
    res.status(200).json(allProducts);
  } catch (error) {
    next(error)
  }
}

async function listProductByName(req, res, next) {
  try {
    const result = await svc.getProductByProductName(req.params.product_name)

    if (!result.success) {
      res.status(result.code).json(result.message)
    }

    res.status(200).json(result)

  } catch (error) {
    next(error)
  }
}

async function newProduct(req, res, next) {	
	try {
		const result = await svc.createProduct(req.body)

		if(!result.success) {
			res.status(result.code).json(result.message)
		} 
			
    res.status(200).json(result)
	} catch (error) {
		next(error)	
	}
}

module.exports = {
  listProducts,
  listProductByName,
  newProduct,
};