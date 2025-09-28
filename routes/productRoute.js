const express = require('express');
const { createProduct, getProducts, getProductByProductName } = require('../controllers/productController');
const router = express.Router();

router.post('/create', createProduct);
router.get('/', getProducts);
router.get('/:product_name', getProductByProductName)


module.exports = router;