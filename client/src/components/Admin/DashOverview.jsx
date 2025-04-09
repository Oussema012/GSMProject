import React from 'react';
import { 
    FaServer, 
    FaNetworkWired, 
    FaChartLine, 
    FaExclamationTriangle, 
    FaCheckCircle,
    FaClock,
    FaDesktop,
    FaLaptop,
    FaMobileAlt,
    FaFileAlt,
    FaProjectDiagram 
  } from 'react-icons/fa';
  



const DashOverview = ({ stats, recentActivities }) => {
  // Default stats if not provided
  const defaultStats = {
    totalDevices: 24,
    activeDevices: 18,
    offlineDevices: 6,
    cpuUsage: '32%',
    memoryUsage: '45%',
    networkThroughput: '1.2 Gbps',
    topologyChanges: 4,
    alerts: 3
  };

  const deviceStats = stats || defaultStats;

  // Device types breakdown
  const deviceTypes = [
    { name: 'Routers', count: 8, icon: <FaProjectDiagram  className="text-blue-500" /> },
    { name: 'Switches', count: 6, icon: <FaNetworkWired className="text-green-500" /> },
    { name: 'End Devices', count: 7, icon: <FaLaptop className="text-purple-500" /> },
    { name: 'Firewalls', count: 3, icon: <FaServer className="text-red-500" /> }
  ];

  // Recent activities with status indicators
  const activities = recentActivities || [
    { id: 1, device: 'Core Router 1', action: 'Configuration updated', time: '2 mins ago', status: 'success' },
    { id: 2, device: 'Switch 3', action: 'Port disabled', time: '15 mins ago', status: 'warning' },
    { id: 3, device: 'Firewall 2', action: 'Security policy applied', time: '32 mins ago', status: 'success' },
    { id: 4, device: 'Server 5', action: 'High CPU usage', time: '1 hour ago', status: 'error' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-700 text-white rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">GNS3 Network Dashboard</h2>
            <p className="text-blue-200">Monitor and manage your network devices and topologies</p>
          </div>
          <button className="bg-white text-blue-800 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition flex items-center">
            <FaFileAlt className="mr-2" />
            View Reports
          </button>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Network Overview</h1>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Refresh Status
          </button>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
            Quick Actions
          </button>
        </div>
      </div>

      {/* Rest of the dashboard content remains the same */}
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Devices */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Devices</p>
              <h3 className="text-3xl font-bold mt-1">{deviceStats.totalDevices}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FaServer className="text-blue-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <FaCheckCircle className="text-green-500 mr-1" />
            <span>{deviceStats.activeDevices} active</span>
            <span className="mx-2">•</span>
            <FaExclamationTriangle className="text-red-500 mr-1" />
            <span>{deviceStats.offlineDevices} offline</span>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Resource Usage</p>
              <h3 className="text-3xl font-bold mt-1">{deviceStats.cpuUsage}</h3>
              <p className="text-sm text-gray-500 mt-1">CPU / {deviceStats.memoryUsage} Memory</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FaChartLine className="text-green-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: deviceStats.cpuUsage }}
              ></div>
            </div>
          </div>
        </div>

        {/* Network Throughput */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Network Throughput</p>
              <h3 className="text-3xl font-bold mt-1">{deviceStats.networkThroughput}</h3>
              <p className="text-sm text-gray-500 mt-1">Current traffic</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FaNetworkWired className="text-purple-600 text-xl" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
            <span>Stable connection</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Alerts</p>
              <h3 className="text-3xl font-bold mt-1">{deviceStats.alerts}</h3>
              <p className="text-sm text-gray-500 mt-1">Require attention</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <FaExclamationTriangle className="text-red-600 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <button className="text-sm text-red-600 hover:text-red-700 font-medium">
              View All Alerts
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Types Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Device Types</h2>
          <div className="space-y-4">
            {deviceTypes.map((type, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3">
                    {type.icon}
                  </div>
                  <span className="font-medium">{type.name}</span>
                </div>
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">
                  {type.count}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
              View All Devices
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="mr-3 mt-1">
                  {activity.status === 'success' && <FaCheckCircle className="text-green-500" />}
                  {activity.status === 'warning' && <FaExclamationTriangle className="text-yellow-500" />}
                  {activity.status === 'error' && <FaExclamationTriangle className="text-red-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{activity.device}</h4>
                    <span className="text-sm text-gray-500 flex items-center">
                      <FaClock className="mr-1" size={12} />
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Full Activity Log
            </button>
          </div>
        </div>

        {/* Network Topology Preview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Network Topology</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Physical View
              </button>
              <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                Logical View
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-4 flex items-center justify-center h-64">
            <div className="text-center">
              <FaNetworkWired className="mx-auto text-gray-400 text-4xl mb-2" />
              <p className="text-gray-500">Network topology visualization</p>
              <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                Open in Topology Viewer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashOverview;