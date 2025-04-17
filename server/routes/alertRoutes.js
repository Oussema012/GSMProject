const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');
// const { protect } = require('../middleware/authMiddleware');

router.post('/', alertController.createAlert);
router.get('/getAlerts', alertController.getAlerts);
router.patch('/:id/resolve', alertController.resolveAlert);
router.patch('/device/:deviceId/resolve-all', alertController.resolveAllDeviceAlerts);

module.exports = router;
