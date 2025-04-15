const Alert = require('../models/Alert');

exports.createAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    
    // Broadcast to WebSocket clients
    req.app.get('websocket').broadcastAlert(alert);
    
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAlerts = async (req, res) => {
  try {
    const { resolved, deviceId } = req.query;
    const filter = {};
    
    if (resolved !== undefined) filter.resolved = resolved === 'true';
    if (deviceId) filter.deviceId = deviceId;
    
    const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(50);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { resolved: true },
      { new: true }
    );
    
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.resolveAllDeviceAlerts = async (req, res) => {
  try {
    const result = await Alert.updateMany(
      { deviceId: req.params.deviceId, resolved: false },
      { resolved: true }
    );
    res.json({ message: `${result.nModified} alerts resolved` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};