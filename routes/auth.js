const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const role = require('../middleware/role');
const auth = require('../middleware/auth');

router.post('/login', validate.login, authController.login);
router.post('/register', auth, role(['admin']), validate.register, authController.register);

module.exports = router;