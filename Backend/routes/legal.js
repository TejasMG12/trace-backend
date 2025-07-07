const express = require('express');
const router = express.Router();
const legalController = require('../controllers/legalController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');

router.post('/assist', auth, role(['admin', 'inspector']), validate.legalAssist, legalController.assistLegal);
router.post('/fir', auth, role(['admin', 'inspector']), validate.fir, legalController.generateFir);

module.exports = router;