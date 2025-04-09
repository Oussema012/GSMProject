const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    ip: { type: String, default: "N/A" },
    DeviceStatus: { type: String, default: "Unknown" },
    macAddress: { type: String, default: "N/A" },
    gateway: { type: String, default: "N/A" },
    dns: { type: String, default: "N/A" },
    lPort: { type: String, default: "N/A" },
    rHostPort: { type: String, default: "N/A" },
    mtu: { type: String, default: "1500" },
    projectId: { type: String, required: true }, // Add projectId
    nodeId: { type: String, required: true }, // Add nodeId
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", DeviceSchema);
module.exports = Device;