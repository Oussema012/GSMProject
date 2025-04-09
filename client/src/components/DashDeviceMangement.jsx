import React, { useState } from 'react';
import {
  FaServer,
  FaNetworkWired,
  FaDesktop,
  FaLaptop,
  FaMobileAlt,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPowerOff,
  FaSync,
  FaFilter,
  FaChevronDown
} from 'react-icons/fa';

const DashDeviceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedDevice, setExpandedDevice] = useState(null);

  // Sample device data
  const devices = [
    {
      id: 1,
      name: 'Core Router 1',
      type: 'router',
      status: 'active',
      ip: '192.168.1.1',
      model: 'Cisco 7200',
      lastSeen: '2 minutes ago',
      cpu: '32%',
      memory: '45%'
    },
    {
      id: 2,
      name: 'Switch Cluster A',
      type: 'switch',
      status: 'active',
      ip: '192.168.1.2',
      model: 'Juniper EX4300',
      lastSeen: '5 minutes ago',
      cpu: '18%',
      memory: '30%'
    },
    {
      id: 3,
      name: 'Firewall Main',
      type: 'firewall',
      status: 'warning',
      ip: '192.168.1.3',
      model: 'FortiGate 100F',
      lastSeen: '10 minutes ago',
      cpu: '75%',
      memory: '60%'
    },
    {
      id: 4,
      name: 'Server Node 1',
      type: 'server',
      status: 'inactive',
      ip: '192.168.1.4',
      model: 'Dell R740',
      lastSeen: '1 hour ago',
      cpu: '0%',
      memory: '5%'
    },
    {
      id: 5,
      name: 'Workstation 101',
      type: 'endpoint',
      status: 'active',
      ip: '192.168.1.101',
      model: 'HP EliteDesk',
      lastSeen: '15 minutes ago',
      cpu: '12%',
      memory: '25%'
    }
  ];

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         device.ip.includes(searchTerm);
    const matchesFilter = activeFilter === 'all' || device.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'router': return <FaNetworkWired className="text-blue-500" />;
      case 'switch': return <FaNetworkWired className="text-green-500" />;
      case 'firewall': return <FaServer className="text-red-500" />;
      case 'server': return <FaServer className="text-purple-500" />;
      case 'endpoint': return <FaLaptop className="text-gray-500" />;
      default: return <FaDesktop className="text-gray-400" />;
    }
  };

  const toggleExpand = (id) => {
    setExpandedDevice(expandedDevice === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Device Management</h1>
          <p className="text-gray-600">Manage all network devices in your GNS3 environment</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center">
          <FaPlus className="mr-2" />
          Add Device
        </button>
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
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="inactive">Inactive</option>
            </select>
            <FaChevronDown className="text-gray-500 ml-2" />
          </div>
          <button className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FaSync className="text-gray-600" />
          </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Seen</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDevices.map((device) => (
                <React.Fragment key={device.id}>
                  <tr 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(device.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{device.name}</div>
                          <div className="text-sm text-gray-500">{device.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(device.status)} text-white`}>
                        {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.lastSeen}
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
                            <h4 className="text-sm font-medium text-gray-500">CPU Usage</h4>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${device.cpu > 70 ? 'bg-red-500' : 'bg-blue-500'}`}
                                style={{ width: device.cpu }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{device.cpu}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Memory Usage</h4>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${device.memory > 70 ? 'bg-red-500' : 'bg-green-500'}`}
                                style={{ width: device.memory }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{device.memory}</p>
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
      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <FaSearch className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No devices found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try adjusting your search or filter' : 'Add your first device to get started'}
          </p>
          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add New Device
          </button>
        </div>
      )}
    </div>
  );
};

export default DashDeviceManagement;