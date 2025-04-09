const express = require("express");
const router = express.Router();
const GNS3Controller = require("../controllers/GNS3Controller"); // Import the controller

// Define routes
router.post("/sync-devices", GNS3Controller.syncDevicesFromGNS3);
router.get("/device-details/:projectId/:nodeId", GNS3Controller.getDeviceDetails);

module.exports = router;