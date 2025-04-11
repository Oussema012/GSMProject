import React, { useState, useEffect } from 'react';
import {
  FaServer,
  FaNetworkWired,
  FaDesktop,
  FaLaptop,
  FaSearch,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaSync,
  FaFilter,
  FaChevronDown,
  FaEye,
  FaTimes,
  FaCog,
  FaScroll
} from 'react-icons/fa';
import { FaCloud } from 'react-icons/fa';

const DashDeviceManagement = () => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deviceDetails, setDeviceDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [currentDevice, setCurrentDevice] = useState(null);
  const [logs, setLogs] = useState('');
  const [config, setConfig] = useState('');

  const projectId = "8a320aab-0962-4e2f-8ddf-6ac58e279877";

  // Animation styles
  const modalStyles = `
    @keyframes popIn {
      0% { transform: scale(0.95); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-popIn {
      animation: popIn 0.2s ease-out forwards;
    }
  `;

  // Device type mapping
  const deviceTypeMap = {
    router: { icon: <FaNetworkWired className="text-blue-500" />, color: 'text-blue-500' },
    switch: { icon: <FaNetworkWired className="text-green-500" />, color: 'text-green-500' },
    firewall: { icon: <FaServer className="text-red-500" />, color: 'text-red-500' },
    server: { icon: <FaServer className="text-purple-500" />, color: 'text-purple-500' },
    computer: { icon: <FaLaptop className="text-gray-500" />, color: 'text-gray-500' },
    cloud: { icon: <FaCloud className="text-cyan-500" />, color: 'text-cyan-500' },
    default: { icon: <FaDesktop className="text-gray-400" />, color: 'text-gray-400' }
  };

  // Helper functions
  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || 'unknown';
    switch (statusLower) {
      case 'started': return 'bg-green-500';
      case 'suspended': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDeviceType = (name) => {
    if (!name) return 'Unknown';
    
    const lowerName = name.toLowerCase();
    if (/router|^r\d|rt|rtr/.test(lowerName)) return 'Router';
    if (/switch|^s\d|sw/.test(lowerName)) return 'Switch';
    if (/firewall|fw|palo|forti|asa/.test(lowerName)) return 'Firewall';
    if (/server|srv|vm|esxi|hyperv/.test(lowerName)) return 'Server';
    if (/pc|laptop|workstation|desktop/.test(lowerName)) return 'Computer';
    if (/cloud|aws|azure|gcp/.test(lowerName)) return 'Cloud';
    return 'Unknown';
  };

  const getDeviceIcon = (name) => {
    const type = getDeviceType(name).toLowerCase();
    return deviceTypeMap[type]?.icon || deviceTypeMap.default.icon;
  };

  // API functions
  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/gns3/sync-devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setDevices(data.devices || []);
      setError(null);
    } catch (error) {
      console.error("Error fetching devices:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceDetails = async (projectId, nodeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gns3/device-details/${projectId}/${nodeId}`);
      const data = await response.json();
      return {
        ...data.details,
        type: getDeviceType(data.details?.name)
      };
    } catch (error) {
      console.error("Error fetching device details:", error);
      return null;
    }
  };

  const fetchDeviceLogs = async (device) => {
    try {
      // Replace with actual API endpoint for logs
      const response = await fetch(`http://localhost:5000/api/gns3/device-logs/${device.projectId}/${device.nodeId}`);
      const data = await response.json();
      setLogs(data.logs || 'No logs available');
      setShowLogsModal(true);
      setCurrentDevice(device);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setError("Failed to fetch logs");
    }
  };

  const fetchDeviceConfig = async (device) => {
    try {
      // Replace with actual API endpoint for config
      const response = await fetch(`http://localhost:5000/api/gns3/device-config/${device.projectId}/${device.nodeId}`);
      const data = await response.json();
      setConfig(data.config || 'No configuration available');
      setShowConfigModal(true);
      setCurrentDevice(device);
    } catch (error) {
      console.error("Error fetching config:", error);
      setError("Failed to fetch configuration");
    }
  };

  // Event handlers
  const handleViewDetails = async (device) => {
    try {
      const details = await getDeviceDetails(device.projectId, device.nodeId);
      setDeviceDetails(details);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching device details:", error);
      setError("Failed to load device details");
    }
  };

  const toggleExpand = (device) => {
    setExpandedDevice(expandedDevice === device.id ? null : device.id);
  };

  const refreshDevices = () => fetchDevices();

  // Effects
  useEffect(() => {
    fetchDevices();
  }, [projectId]);

  // Filtered devices
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (device.ip && device.ip.includes(searchTerm));
    
    const matchesStatusFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && device.DeviceStatus?.toLowerCase() === 'started') ||
      (activeFilter === 'inactive' && device.DeviceStatus?.toLowerCase() === 'stopped') ||
      (activeFilter === 'warning' && device.DeviceStatus?.toLowerCase() === 'suspended');
    
    return matchesSearch && matchesStatusFilter;
  });

  // Loading and error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Error: {error}</div>
        <button 
          onClick={refreshDevices}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style>{modalStyles}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Device Management</h1>
          <p className="text-gray-600">Manage your GNS3 network devices</p>
        </div>
        <button 
          onClick={refreshDevices}
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 px-4 py-2"
        >
          <FaSync className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
          <FaFilter className="text-gray-500 mr-2" />
          <select
            className="appearance-none focus:outline-none bg-transparent"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="active">Started</option>
            <option value="warning">Suspended</option>
            <option value="inactive">Stopped</option>
          </select>
          <FaChevronDown className="text-gray-500 ml-2" />
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <React.Fragment key={device.id || device.nodeId}>
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => toggleExpand(device)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getDeviceIcon(device.name)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{device.name}</div>
                          <div className="text-sm text-gray-500">{device.nodeId}</div>
                        </div>
                      </div>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onClick={() => toggleExpand(device)}
                    >
                      {device.ip || 'N/A'}
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap"
                      onClick={() => toggleExpand(device)}
                    >
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.DeviceStatus)} text-white`}>
                        {device.DeviceStatus?.charAt(0)?.toUpperCase() + device.DeviceStatus?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td 
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      onClick={() => toggleExpand(device)}
                    >
                      {getDeviceType(device.name)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(device);
                          }}
                          title="View details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                          title="Edit device"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-800"
                          onClick={(e) => e.stopPropagation()}
                          title="Delete device"
                        >
                          <FaTrash />
                        </button>
                        <button 
                          className="text-gray-600 hover:text-gray-800"
                          onClick={(e) => e.stopPropagation()}
                          title="Power control"
                        >
                          <FaPowerOff />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedDevice === device.id && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">MAC Address</h4>
                            <p className="text-sm text-gray-900 mt-1">{device.macAddress || 'N/A'}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Gateway</h4>
                            <p className="text-sm text-gray-900 mt-1">{device.gateway || 'N/A'}</p>
                          </div>
                          <div className="flex items-end space-x-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchDeviceConfig(device);
                              }}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                            >
                              <FaCog className="mr-1" /> Configure
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchDeviceLogs(device);
                              }}
                              className="flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                            >
                              <FaScroll className="mr-1" /> View Logs
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredDevices.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No devices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search' : 'Add your first device to get started'}
          </p>
          <button 
            onClick={refreshDevices}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh Devices
          </button>
        </div>
      )}

      {/* Device Details Modal */}
      {showDetailsModal && deviceDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="animate-popIn bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <div className="flex items-center">
                  {getDeviceIcon(deviceDetails.name)}
                  <h3 className="ml-2 text-xl font-bold text-gray-900">
                    {deviceDetails.name || 'Device Details'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Device Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Hostname</p>
                      <p className="text-sm font-medium">{deviceDetails.hostname || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Model</p>
                      <p className="text-sm font-medium">{deviceDetails.model || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Uptime</p>
                      <p className="text-sm font-medium">{deviceDetails.uptime || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="text-sm font-medium">{deviceDetails.type || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-700">Network Information</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">IP Address</p>
                      <p className="text-sm font-medium">{deviceDetails.ip || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">MAC Address</p>
                      <p className="text-sm font-medium">{deviceDetails.macAddress || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gateway</p>
                      <p className="text-sm font-medium">{deviceDetails.gateway || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">DNS</p>
                      <p className="text-sm font-medium">{deviceDetails.dns || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {deviceDetails.interfaces?.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-700">Interfaces</h4>
                    <div className="space-y-1">
                      {deviceDetails.interfaces.map((intf, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="font-medium">{intf.name}</span>
                          <span>{intf.ip || 'No IP'}</span>
                          <span className={`${intf.status === 'UP' ? 'text-green-500' : 'text-red-500'}`}>
                            ({intf.status})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => setShowDetailsModal(false)}
                className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logs Modal */}
      {showLogsModal && currentDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="animate-popIn bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <div className="flex items-center">
                  <FaScroll className="text-blue-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Logs for {currentDevice.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowLogsModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                  {logs}
                </pre>
              </div>
              
              <button
                onClick={() => setShowLogsModal(false)}
                className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && currentDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="animate-popIn bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <div className="flex items-center">
                  <FaCog className="text-blue-500 mr-2" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Configuration for {currentDevice.name}
                  </h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
                  {config}
                </pre>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashDeviceManagement;