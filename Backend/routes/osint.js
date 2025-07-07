const express = require('express');
const router = express.Router();
const osintController = require('../controllers/osintController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');

router.post('/profile', auth, role(['admin', 'inspector', 'analyst']), validate.osint, osintController.getOsintProfile);

module.exports = router;