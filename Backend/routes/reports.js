const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');

router.post('/generate', auth, role(['admin', 'inspector']), validate.report, reportController.generateReport);

module.exports = router;