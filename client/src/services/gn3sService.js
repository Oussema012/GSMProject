const API_BASE_URL = "http://localhost:5000/api/gns3";

export const syncDevices = async (projectId) => {
  const response = await fetch(`${API_BASE_URL}/sync-devices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId }),
  });
  return response.json();
};

export const getDeviceDetails = async (projectId, nodeId) => {
  const response = await fetch(`${API_BASE_URL}/device-details/${projectId}/${nodeId}`);
  return response.json();
};