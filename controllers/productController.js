const { getAllProducts, getProductByProductName, createProduct } = require('../services/productService');

function listProducts(req, res, next) {
  try {
    const allProducts = getAllProducts();
    res.status(200).json(allProducts);
  } catch (error) {
    next(error)
  }
}

async function listProductByName(req, res, next) {
  try {
    const result = await getProductByProductName(req.params.product_name)

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
		const result = await createProduct(req.body)

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