const Alert = require('../models/Alert');

// Create and save a new alert
exports.createAlert = async (req, res) => {
  try {
    const alert = new Alert(req.body);
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    console.error(error);  // log error for server-side debugging
    res.status(400).json({ error: error.message });
  }
};

// Get alerts with optional filters: resolved, deviceId, lastMinutes
exports.getAlerts = async (req, res) => {
  try {
    const { resolved, deviceId, lastMinutes } = req.query;
    const filter = {};

    if (resolved !== undefined) filter.resolved = resolved === 'true';
    if (deviceId) filter.deviceId = deviceId;
    if (lastMinutes) {
      filter.createdAt = {
        $gte: new Date(Date.now() - parseInt(lastMinutes) * 60000)
      };
    }

    const alerts = await Alert.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(alerts);
  } catch (error) {
    console.error(error);  // log error for server-side debugging
    res.status(500).json({ error: error.message });
  }
};

// Resolve a single alert
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
    console.error(error);  // log error for server-side debugging
    res.status(400).json({ error: error.message });
  }
};

// Resolve all alerts for a given device
exports.resolveAllDeviceAlerts = async (req, res) => {
  try {
    const result = await Alert.updateMany(
      { deviceId: req.params.deviceId, resolved: false },
      { resolved: true }
    );

    res.json({ message: `${result.modifiedCount} alerts resolved` });
  } catch (error) {
    console.error(error);  // log error for server-side debugging
    res.status(400).json({ error: error.message });
  }
};

// Delete an alert by ID
// Delete a single alert by ID
exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) return res.status(404).json({ error: 'Alert not found' });

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

