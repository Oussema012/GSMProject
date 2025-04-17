const mongoose = require('mongoose');

// Define the alert schema
const alertSchema = new mongoose.Schema({
  deviceId: { 
    type: String, 
    required: true,
    // Optional: Add a reference to the Device collection if you have one
    // ref: 'Device' 
  },
  deviceName: { type: String },
  alertType: { 
    type: String, 
    enum: ['connectivity', 'cpu', 'memory', 'interface', 'protocol'],
    required: true 
  },
  protocol: {
    type: String,
    enum: ['http', 'snmp', 'icmp'],
    default: null
  },
  severity: {
    type: String,
    enum: ['critical', 'major', 'minor', 'warning'],
    required: true
  },
  message: { 
    type: String, 
    required: true 
  },
  resolved: { 
    type: Boolean, 
    default: false 
  },
  details: { 
    type: Object 
  }
}, { 
  timestamps: true  // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Alert', alertSchema);
