const express = require('express');
const { listUsers, listUserByUsername, newUser } = require('../controllers/userController');
const router = express.Router();


router.get('/', listUsers)
router.get('/:username', listUserByUsername)
router.post('/create', newUser)

module.exports = router;