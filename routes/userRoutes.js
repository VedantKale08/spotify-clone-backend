const express = require('express');
const { register, login, getUser } = require('../controllers/userController');
const protectUser = require('../middleware/user');

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route("/").get(protectUser,getUser);

module.exports = router;