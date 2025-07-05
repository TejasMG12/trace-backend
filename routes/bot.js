const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const validate = require('../middleware/validate');

router.post('/start', auth, role(['admin', 'inspector']), validate.botStart, botController.startBot);
router.get('/conversation/:botId', auth, role(['admin', 'inspector', 'analyst']), botController.getConversation);
router.delete('/:botId', auth, role(['admin', 'inspector']), botController.stopBot);

module.exports = router;