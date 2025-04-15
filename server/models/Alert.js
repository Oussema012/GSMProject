const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceName: { type: String },
  alertType: { 
    type: String, 
    enum: ['connectivity', 'cpu', 'memory', 'interface', 'protocol'],
    required: true 
  },
  severity: {
    type: String,
    enum: ['critical', 'major', 'minor', 'warning'],
    required: true
  },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  details: { type: Object }
}, { timestamps: true });

// Indexes
alertSchema.index({ deviceId: 1 });
alertSchema.index({ resolved: 1 });
alertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);