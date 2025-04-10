import React, { useState, useEffect } from 'react';
import {
  FaServer,
  FaNetworkWired,
  FaDesktop,
  FaLaptop,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaSync,
  FaFilter,
  FaChevronDown
} from 'react-icons/fa';
import { FaCloud } from 'react-icons/fa';

const DashDeviceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedDevice, setExpandedDevice] = useState(null);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Replace with your GNS3 project ID
  const projectId = "8a320aab-0962-4e2f-8ddf-6ac58e279877";

  // Fetch devices on component mount
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/api/gns3/sync-devices", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ projectId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDevices(data.devices || []);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setError(error.message);
        setDevices([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [projectId]);

  const refreshDevices = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/gns3/sync-devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDevices(data.devices || []);
    } catch (error) {
      console.error("Error refreshing devices:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDeviceDetails = async (projectId, nodeId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/gns3/device-details/${projectId}/${nodeId}`);
      const data = await response.json();
      return data.details;
    } catch (error) {
      console.error("Error fetching device details:", error);
      return null;
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (device.ip && device.ip.includes(searchTerm)) ||
                         (device.macAddress && device.macAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatusFilter = 
      activeFilter === 'all' || 
      (activeFilter === 'active' && device.DeviceStatus.toLowerCase() === 'started') ||
      (activeFilter === 'inactive' && device.DeviceStatus.toLowerCase() === 'stopped') ||
      (activeFilter === 'warning' && device.DeviceStatus.toLowerCase() === 'suspended') ||
      (activeFilter === 'unknown' && device.DeviceStatus.toLowerCase() === 'unknown');
    
    return matchesSearch && matchesStatusFilter;
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'started': return 'bg-green-500';
      case 'suspended': return 'bg-yellow-500';
      case 'stopped': return 'bg-red-500';
      case 'unknown': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDeviceIcon = (deviceName) => {
    if (!deviceName) return <FaDesktop className="text-gray-400" />;
    
    const firstLetter = deviceName.charAt(0).toLowerCase();
    
    switch (firstLetter) {
      case 'r': // Router
        return <FaNetworkWired className="text-blue-500" />;
      case 'c': // Cloud
        return <FaCloud className="text-cyan-500" />;
      case 'f': // Firewall
        return <FaServer className="text-red-500" />;
      case 'p': // PC/Workstation
        return <FaLaptop className="text-gray-500" />;
      case 's': // Switch/Server
        // Additional check to differentiate between Switch and Server
        if (deviceName.toLowerCase().includes('server') || 
            deviceName.toLowerCase().includes('vm') ||
            deviceName.toLowerCase().includes('esxi')) {
          return <FaServer className="text-purple-500" />;
        }
        return <FaNetworkWired className="text-green-500" />;
      default:
        // Fallback to type detection from full name if first letter doesn't match
        if (deviceName.toLowerCase().includes('router')) {
          return <FaNetworkWired className="text-blue-500" />;
        }
        if (deviceName.toLowerCase().includes('cloud')) {
          return <FaCloud className="text-cyan-500" />;
        }
        if (deviceName.toLowerCase().includes('firewall')) {
          return <FaServer className="text-red-500" />;
        }
        if (deviceName.toLowerCase().includes('pc') || 
            deviceName.toLowerCase().includes('workstation')) {
          return <FaLaptop className="text-gray-500" />;
        }
        if (deviceName.toLowerCase().includes('switch')) {
          return <FaNetworkWired className="text-green-500" />;
        }
        if (deviceName.toLowerCase().includes('server')) {
          return <FaServer className="text-purple-500" />;
        }
        return <FaDesktop className="text-gray-400" />;
    }
  };
  const getDeviceType = (name) => {
    if (!name) return 'Unknown';
  
    const lowerName = name.toLowerCase().trim();
  
    // Extended device type mapping
    const typeMap = [
      { patterns: ['router', 'rt', 'rtr', '^r\\d', 'mpls'], type: 'Router' },
      { patterns: ['switch', 'sw', '^s\\d', 'layer2', 'l2'], type: 'Switch' },
      { patterns: ['firewall', 'fw', 'palo', 'forti', 'asa'], type: 'Firewall' },
      { patterns: ['load balancer', 'lb', 'f5', 'citrix'], type: 'Load Balancer' },
      { patterns: ['access point', 'ap', 'wifi', 'wireless'], type: 'Access Point' },
      { patterns: ['server', 'srv', 'esxi', 'hyperv'], type: 'Server' },
      { patterns: ['pc', 'laptop', 'workstation', 'desktop'], type: 'Computer' },
      { patterns: ['cloud', 'aws', 'azure', 'gcp'], type: 'Cloud' },
      { patterns: ['vm', 'virtual machine'], type: 'Virtual Machine' },
      { patterns: ['container', 'docker', 'kubernetes'], type: 'Container' },
      { patterns: ['iot', 'sensor', 'smart'], type: 'IoT Device' },
      { patterns: ['phone', 'voip', 'ipphone'], type: 'Phone' },
      { patterns: ['printer', 'print'], type: 'Printer' },
      { patterns: ['nas', 'san', 'storage'], type: 'Storage' },
      { patterns: ['camera', 'ipcam'], type: 'Camera' },
      { patterns: ['nat', 'nat device'], type: 'NAT Device' },
      { patterns: ['atm', 'atm switch'], type: 'ATM Switch' },
      { patterns: ['proxy', 'squid'], type: 'Proxy Server' },
      { patterns: ['ids', 'ips', 'security'], type: 'Security Device' },
      { patterns: ['modem', 'dsl', 'cable'], type: 'Modem' },
      { patterns: ['hub', 'repeater'], type: 'Hub' },
      { patterns: ['bridge', 'wireless bridge'], type: 'Bridge' },
      { patterns: ['gateway', 'media gateway'], type: 'Gateway' },
      { patterns: ['pbx', 'phone system'], type: 'PBX' },
      { patterns: ['ups', 'power supply'], type: 'UPS' }
    ];
  
    // Check for matches in priority order
    for (const { patterns, type } of typeMap) {
      for (const pattern of patterns) {
        const regex = new RegExp(pattern);
        if (regex.test(lowerName)) {
          return type;
        }
      }
    }
  
    // Check for common prefixes if no direct match
    const prefix = lowerName.split(/\s+/)[0];
    const prefixMap = {
      'r': 'Router',
      'sw': 'Switch',
      'fw': 'Firewall',
      'ap': 'Access Point',
      'lb': 'Load Balancer',
      'vm': 'Virtual Machine',
      'nat': 'NAT Device',
      'atm': 'ATM Switch'
    };
  
    for (const [p, type] of Object.entries(prefixMap)) {
      if (prefix.startsWith(p)) {
        return type;
      }
    }
  
    // Final fallback - clean up and return the first word
    return name.split(/\s+/)[0]
      .replace(/[^a-zA-Z0-9]/, '')
      .replace(/^./, c => c.toUpperCase());
  };
  
  const toggleExpand = async (device) => {
    if (expandedDevice === device.id) {
      setExpandedDevice(null);
    } else {
      // Fetch additional details when expanding
      const details = await getDeviceDetails(device.projectId, device.nodeId);
      setExpandedDevice(device.id);
      // You might want to store these details in state or merge them with the device object
    }
  };

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
        <div className="text-red-500 mb-4">Error loading devices: {error}</div>
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
   {/* Header and Controls */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
  <div>
    <h1 className="text-2xl font-bold text-gray-800">Device Management</h1>
    <p className="text-gray-600">View all network devices in your GNS3 environment</p>
  </div>
  <div className="flex space-x-2">
    <button 
      onClick={refreshDevices}
      className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 px-4 py-2"
      title="Refresh devices"
    >
      <FaSync className={`text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
      <span className="text-gray-700">Refresh</span>
    </button>
  </div>
</div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search devices by name or IP..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
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
              <option value="unknown">Unknown</option>
            </select>
            <FaChevronDown className="text-gray-500 ml-2" />
          </div>
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
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(device)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.ip || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.DeviceStatus)} text-white`}>
                        {device.DeviceStatus.charAt(0).toUpperCase() + device.DeviceStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  {getDeviceType(device.name)} {/* New line */}
</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <FaEdit />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <FaTrash />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
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
                            <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                              Configure
                            </button>
                            <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                              View Logs
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
            {searchTerm ? 'Try adjusting your search or filter' : 'Add your first device to get started'}
          </p>
          <button 
            onClick={refreshDevices}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Refresh Devices
          </button>
        </div>
      )}
    </div>
  );
};

export default DashDeviceManagement;