const express = require('express');
const router = express.Router();
const suspectController = require('../controllers/suspectController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');

router.get('/', auth, role(['admin', 'inspector', 'analyst']), suspectController.getSuspects);
router.get('/:id', auth, role(['admin', 'inspector', 'analyst']), suspectController.getSuspectById);
router.post('/', auth, role(['admin', 'inspector']), validate.suspect, suspectController.createSuspect);

module.exports = router;