const express = require('express');
const { getUserByUsername, getAllUsers, createUser } = require('../controllers/userController');
const router = express.Router();


router.get('/', getAllUsers)
router.get('/:username', getUserByUsername)
router.post('/create', createUser)

module.exports = router;