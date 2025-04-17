import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FaExclamationTriangle,
  FaServer,
  FaNetworkWired,
  FaMicrochip,
  FaMemory,
  FaPlug,
  FaCheck,
  FaClock,
  FaSpinner,
  FaTimes
} from 'react-icons/fa';

const AlertCenter = ({ alertLevel = 'admin' }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(10000);

  // Role-based severity filtering
  const getSeverityFilter = (level) => {
    const rolePermissions = {
      admin: ['critical', 'major', 'minor', 'warning'],
      engineer: ['critical', 'major', 'minor'],
      technician: ['critical', 'major'],
      default: ['critical']
    };
    return rolePermissions[level] || rolePermissions.default;
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/alerts/getAlerts', {
        params: { 
          resolved: false,
          severity: getSeverityFilter(alertLevel).join(','),
          sort: '-createdAt',
          limit: 50
        }
      });
      
      // Ensure we always set an array, even if response.data is undefined
      const alertData = Array.isArray(response?.data) ? response.data : [];
      setAlerts(alertData);
    } catch (err) {
      setError(err.message);
      setAlerts([]); // Reset to empty array on error
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId) => {
  if (!alertId || typeof alertId !== 'string' || !alertId.match(/^[0-9a-fA-F]{24}$/)) {
    setError('Invalid alert ID');
    return;
  }

  try {
    await axios.patch(`http://localhost:5000/api/alerts/${alertId}/resolve`);
    setAlerts((prev) => prev.filter((alert) => alert._id !== alertId));
  } catch (err) {
    setError(`Failed to resolve alert: ${err.message}`);
  }
};


useEffect(() => {
  let isMounted = true;

  const intervals = [10000, 15000, 30000]; // 10s, 15s, 30s

  const fetchWithRandomInterval = async () => {
    if (!isMounted) return;

    await fetchAlerts();

    const randomDelay = intervals[Math.floor(Math.random() * intervals.length)];
    setTimeout(fetchWithRandomInterval, randomDelay);
  };

  fetchWithRandomInterval();

  return () => {
    isMounted = false;
  };
}, [alertLevel]);

  const getAlertIcon = (alertType) => {
    const icons = {
      connectivity: <FaPlug className="text-red-500" />,
      cpu: <FaMicrochip className="text-orange-500" />,
      memory: <FaMemory className="text-yellow-500" />,
      interface: <FaNetworkWired className="text-blue-500" />,
      protocol: <FaServer className="text-purple-500" />,
      default: <FaExclamationTriangle className="text-gray-500" />
    };
    return icons[alertType] || icons.default;
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      major: 'bg-orange-100 text-orange-800',
      minor: 'bg-yellow-100 text-yellow-800',
      warning: 'bg-blue-100 text-blue-800'
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[severity]}`}>
        {severity}
      </span>
    );
  };

  const renderAlertContent = () => {
    // Additional safety check in case alerts is not an array
    if (!Array.isArray(alerts)) {
      return (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <p className="text-yellow-700">Alert data format is invalid</p>
        </div>
      );
    }

    if (alerts.length === 0) {
      return (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <p className="text-green-700">No active alerts found</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert._id || `alert-${Math.random().toString(36).substr(2, 9)}`}
            className="bg-white border-l-4 border-gray-200 shadow-sm rounded-md overflow-hidden"
          >
            <div className={`p-4 ${alert.resolved ? 'bg-gray-50' : 'bg-white'}`}>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getAlertIcon(alert.alertType)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-medium text-gray-900">
                      {alert.deviceName || alert.deviceId || 'Unknown Device'}
                    </h3>
                    <div className="flex space-x-2">
                      {getSeverityBadge(alert.severity)}
                      {!alert.resolved && (
                        <button
                        onClick={() => resolveAlert(alert._id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                        title="Mark as resolved"
                      >
                        <FaCheck />
                      </button>
                      
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {alert.message || 'No message provided'}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    <span>{alert.createdAt ? new Date(alert.createdAt).toLocaleString() : 'Unknown time'}</span>
                    {alert.protocol && (
                      <span className="ml-2 px-2 py-1 bg-gray-100 rounded">
                        {alert.protocol.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {alert.details && (
                    <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                      <pre className="whitespace-pre-wrap break-words">
                        {JSON.stringify(alert.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <FaSpinner className="animate-spin text-2xl text-blue-500" />
        <span className="ml-2">Loading alerts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <FaTimes className="text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            fetchAlerts();
          }}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Network Alerts</h2>
        <div className="flex items-center space-x-2">
          <select 
            value={pollingInterval} 
            onChange={(e) => setPollingInterval(Number(e.target.value))}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5000}>5 seconds</option>
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
          </select>
        </div>
      </div>

      {renderAlertContent()}
    </div>
  );
};

export default AlertCenter;