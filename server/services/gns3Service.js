const axios = require("axios");

// GNS3 server configuration
const GNS3_SERVER_HOST = process.env.GNS3_SERVER_HOST || "localhost";
const GNS3_SERVER_PORT = process.env.GNS3_SERVER_PORT || 3080;

// Function to fetch devices from GNS3
const fetchDevicesFromGNS3 = async (projectId) => {
  try {
    const response = await axios.get(
      `http://${GNS3_SERVER_HOST}:${GNS3_SERVER_PORT}/v2/projects/${projectId}/nodes`
    );
    return response.data || []; // Return an empty array if no data is found
  } catch (error) {
    console.error("Error fetching devices from GNS3:", error);
    throw new Error("Error fetching devices");
  }
};

// Function to get details of a device using 'show ip' command
const getDeviceDetailsFromGNS3 = async (projectId, nodeId) => {
    try {
      const response = await axios.get(
        `http://localhost:3080/v2/projects/${projectId}/nodes/${nodeId}`
      );
      return response.data; // Return the full device details
    } catch (error) {
      console.error("Error fetching GNS3 device details:", error);
      throw new Error("Error fetching device details from GNS3");
    }
  };

module.exports = {
  fetchDevicesFromGNS3,
  getDeviceDetailsFromGNS3,
};