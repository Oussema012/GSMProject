const Device = require("../models/Device");
const { fetchDevicesFromGNS3, getDeviceDetailsFromGNS3 } = require("../services/gns3Service");

// Sync GNS3 devices
const syncDevicesFromGNS3 = async (req, res) => {
    const { projectId } = req.body;
  
    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }
  
    try {
      console.log("Fetching devices from GNS3...");
      const gns3Devices = await fetchDevicesFromGNS3(projectId);
  
      if (!gns3Devices || gns3Devices.length === 0) {
        return res.status(404).json({ message: "No devices found in GNS3 project" });
      }
  
      console.log("Devices fetched from GNS3:", gns3Devices);
  
      // Saving or updating devices in MongoDB
      const savedDevices = await Promise.all(
        gns3Devices.map(async (device) => {
          const existingDevice = await Device.findOne({ name: device.name });
          if (existingDevice) {
            // Update existing device details
            existingDevice.ip = device.properties?.ip_address || "N/A";
            existingDevice.DeviceStatus = device.status || "Unknown";
            existingDevice.macAddress = device.properties?.mac_address || "N/A";
            existingDevice.gateway = device.properties?.gateway || "N/A";
            existingDevice.dns = device.properties?.dns || "N/A";
            existingDevice.lPort = device.properties?.lport || "N/A";
            existingDevice.rHostPort = device.properties?.rhost_port || "N/A";
            existingDevice.mtu = device.properties?.mtu || "1500";
            existingDevice.projectId = projectId; // Add projectId
            existingDevice.nodeId = device.node_id || "N/A"; // Add nodeId
            return await existingDevice.save();
          }
  
          // Create a new device if not already present
          const newDevice = new Device({
            name: device.name,
            ip: device.properties?.ip_address || "N/A",
            DeviceStatus: device.status || "Unknown",
            macAddress: device.properties?.mac_address || "N/A",
            gateway: device.properties?.gateway || "N/A",
            dns: device.properties?.dns || "N/A",
            lPort: device.properties?.lport || "N/A",
            rHostPort: device.properties?.rhost_port || "N/A",
            mtu: device.properties?.mtu || "1500",
            projectId: projectId, // Add projectId
            nodeId: device.node_id || "N/A", // Add nodeId
          });
  
          return await newDevice.save();
        })
      );
  
      res.status(200).json({ message: "Devices synced successfully", devices: savedDevices });
    } catch (error) {
      console.error("Error in syncDevicesFromGNS3:", error);
      res.status(500).json({ message: "Error syncing devices", error: error.message });
    }
  };

// Fetch device details (show ip command)
// controllers/GNS3Controller.js
const getDeviceDetails = async (req, res) => {
    const { projectId, nodeId } = req.params;
  
    if (!projectId || !nodeId) {
      return res.status(400).json({ message: "Project ID and Node ID are required" });
    }
  
    try {
      const deviceDetails = await getDeviceDetailsFromGNS3(projectId, nodeId);
      res.status(200).json({ message: "Device details fetched", details: deviceDetails });
    } catch (error) {
      console.error("Error fetching device details:", error);
      res.status(500).json({ message: "Error fetching device details", error: error.message });
    }
  };

module.exports = {
    syncDevicesFromGNS3,
    getDeviceDetails,
};