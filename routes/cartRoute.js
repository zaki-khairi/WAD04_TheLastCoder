const express = require('express');
const { listCarts, listCartByUsername, addCart, removeCart } = require('../controllers/cartController');
const router = express.Router();

router.get('/', listCarts)
router.get('/:username', listCartByUsername);
router.post('/:username/add', addCart);
router.post('/:username/remove', removeCart);

module.exports = router;
