const express = require('express');
const { listProducts, listProductByName, newProduct } = require('../controllers/productController');
const router = express.Router();

router.get('/', listProducts);
router.get('/:product_name', listProductByName)
router.post('/create', newProduct);



module.exports = router;