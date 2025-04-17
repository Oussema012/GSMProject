import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaUsers,
  FaServer, 
  FaChartBar,
  FaBell,
  FaCog, 
  FaSignOutAlt,
  FaUserCircle,
  FaSearch,
  FaUserShield,
  FaTimes
} from "react-icons/fa";
import axios from 'axios';
import DashOverview from "../components/Admin/DashOverview";
import DashUserManagement from "../components/Admin/DashUserManagement";
import DashDeviceMangement from "../components/Admin/DashDeviceMangement";
import DashReports from "../components/Admin/DashReports";
import DashNotifications from "../components/Admin/DashNotifications";
import DashSettings from "../components/Admin/DashSettings";
import AlertCenter from "../components/AlertCenter";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [username] = useState('Admin');

  // Set active tab from URL query parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    setActiveTab(tabFromUrl || 'dashboard');
  }, [location.search]);

  // Fetch unread alerts count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get('/api/alerts/count', { params: { resolved: false } });
        setUnreadAlerts(response.data.count);
      } catch (error) {
        console.error("Error fetching alert count:", error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Mock data
  const stats = {
    totalUsers: 142,
    activeUsers: 128,
    notificationsSent: 356,
    devicesRegistered: 89,
    systemHealth: "98%",
    storageUsed: "1.2TB/2TB"
  };

  const recentActivities = [
    { id: 1, user: "Alex Johnson", action: "Logged in", time: "2 mins ago", device: "Desktop" },
    { id: 2, user: "Sarah Williams", action: "Changed password", time: "15 mins ago", device: "Mobile" },
    { id: 3, user: "Mike Chen", action: "Updated profile", time: "32 mins ago", device: "Tablet" }
  ];

  // Handle sign out
  const handleSignOut = () => {
    // Add your sign-out logic here
    navigate("/login");
  };

  // Render the dashboard tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashOverview stats={stats} recentActivities={recentActivities} />;
      case 'users':
        return <DashUserManagement />;
      case 'devices':
        return <DashDeviceMangement />;
      case 'reports':
        return <DashReports />;
      case 'notifications':
        return <DashNotifications />;
      case 'settings':
        return <DashSettings />;
      default:
        return <DashOverview stats={stats} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white flex flex-col p-0 shadow-xl">
        <div className="p-6 pb-4 border-b border-blue-700">
          <div className="flex items-center space-x-3">
            <FaUserShield className="text-2xl text-blue-300" />
            <h1 className="text-xl font-bold">Admin Console</h1>
          </div>
          <div className="mt-4 text-sm text-blue-200">
            Welcome back, <span className="font-medium text-white">{username}</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {['dashboard', 'users', 'devices', 'reports', 'notifications', 'settings'].map(tab => (
              <li key={tab}>
                <Link 
                  to={`/admin-dashboard?tab=${tab}`} 
                  className={`flex items-center px-4 py-3 rounded-lg ${activeTab === tab ? 'bg-blue-700 text-white font-medium' : 'hover:bg-blue-700 hover:text-white'} transition`}
                >
                  {tab === 'dashboard' && <FaHome className="mr-3 text-blue-300" />}
                  {tab === 'users' && <FaUsers className="mr-3 text-blue-300" />}
                  {tab === 'devices' && <FaServer className="mr-3 text-blue-300" />}
                  {tab === 'reports' && <FaChartBar className="mr-3 text-blue-300" />}
                  {tab === 'notifications' && <FaBell className="mr-3 text-blue-300" />}
                  {tab === 'settings' && <FaCog className="mr-3 text-blue-300" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'users' && <span className="ml-auto bg-blue-600 text-xs font-semibold px-2 py-1 rounded-full">{stats.totalUsers}</span>}
                  {tab === 'devices' && <span className="ml-auto bg-blue-600 text-xs font-semibold px-2 py-1 rounded-full">{stats.devicesRegistered}</span>}
                  {tab === 'notifications' && <span className="ml-auto bg-blue-600 text-xs font-semibold px-2 py-1 rounded-full">{unreadAlerts > 0 ? unreadAlerts : stats.notificationsSent}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-700">
          <button 
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-sm text-blue-200 hover:text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaSignOutAlt className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Search Bar */}
            <div className="relative w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, devices..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* User Info and Notifications */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAlertModal(!showAlertModal)}
                className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <FaBell className="text-xl" />
                {unreadAlerts > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                    {unreadAlerts}
                  </span>
                )}
              </button>
              
              <div className="flex items-center space-x-2">
                <div className="text-right hidden md:block">
                  <div className="font-medium text-gray-800">{username}</div>
                  <div className="text-xs text-gray-500">System Administrator</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUserCircle className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-blue-50">
          {renderTabContent()}
        </main>
      </div>

      {/* Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowAlertModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Network Alerts
                  </h3>
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="mt-4">
                  <AlertCenter alertLevel="admin" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
