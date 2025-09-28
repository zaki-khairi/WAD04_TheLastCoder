const express = require('express');
const { getCartByUsername, addToCart, removeFromCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/:username', getCartByUsername);
router.post('/:username/add', addToCart);
router.post('/:username/remove', removeFromCart);

module.exports = router;
