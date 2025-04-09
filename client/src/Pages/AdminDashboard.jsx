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
  FaDesktop,
  FaMobileAlt,
  FaEnvelope
} from "react-icons/fa";

import axios from 'axios';
import DashOverview from "../components/Admin/DashOverview";
import DashUserManagement from "../components/Admin/DashUserManagement";
import DashDeviceMangement from "../components/Admin/DashDeviceMangement";
import DashReports from "../components/Admin/DashReports";
import DashNotifications from "../components/Admin/DashNotifications";
import DashSettings from "../components/Admin/DashSettings";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab('dashboard');
    }
  }, [location.search]);

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

  const username = 'Admin';

  return (
    <div className="flex min-h-screen bg-blue-50">
      {/* Sidebar - Dark Blue */}
      <div className="w-64 bg-blue-800 text-white flex flex-col p-0 shadow-xl">
        {/* Sidebar Header */}
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
            <li>
              <Link 
                to="/admin-dashboard?tab=dashboard" 
                className={`flex items-center px-4 py-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-700 text-white font-medium' : 'hover:bg-blue-700 hover:text-white'} transition`}
              >
                <FaHome className="mr-3 text-blue-300" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/admin-dashboard?tab=users" 
                className={`flex items-center px-4 py-3 rounded-lg ${activeTab === 'users' ? 'bg-blue-700 text-white font-medium' : 'hover:bg-blue-700 hover:text-white'} transition`}
              >
                <FaUsers className="mr-3 text-blue-300" />
                User Management
                <span className="ml-auto bg-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {stats.totalUsers}
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin-dashboard?tab=devices" 
                className={`flex items-center px-4 py-3 rounded-lg ${activeTab === 'devices' ? 'bg-blue-700 text-white font-medium' : 'hover:bg-blue-700 hover:text-white'} transition`}
              >
                <FaServer className="mr-3 text-blue-300" />
                Device Management
                <span className="ml-auto bg-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {stats.devicesRegistered}
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin-dashboard?tab=reports" 
                className={`flex items-center px-4 py-3 rounded-lg ${activeTab === 'reports' ? 'bg-blue-700 text-white font-medium' : 'hover:bg-blue-700 hover:text-white'} transition`}
              >
                <FaChartBar className="mr-3 text-blue-300" />
                Reports & Analytics
              </Link>
            </li>
            <li>
              <Link 
                to="/admin-dashboard?tab=notifications" 
                className={`flex items-center px-4 py-3 rounded-lg ${activeTab === 'notifications' ? 'bg-blue-700 text-white font-medium' : 'hover:bg-blue-700 hover:text-white'} transition`}
              >
                <FaBell className="mr-3 text-blue-300" />
                Notifications
                <span className="ml-auto bg-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                  {stats.notificationsSent}
                </span>
              </Link>
            </li>
            <li>
              <Link 
                to="/admin-dashboard?tab=settings" 
                className={`flex items-center px-4 py-3 rounded-lg ${activeTab === 'settings' ? 'bg-blue-700 text-white font-medium' : 'hover:bg-blue-700 hover:text-white'} transition`}
              >
                <FaCog className="mr-3 text-blue-300" />
                System Settings
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Sidebar Footer */}
        <div className="p-4 border-t border-blue-700">
          <button 
            className="flex items-center w-full px-4 py-2 text-sm text-blue-200 hover:text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaSignOutAlt className="mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
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
              <button className="relative p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50">
                <FaBell className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
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
          {activeTab === 'dashboard' && <DashOverview stats={stats} recentActivities={recentActivities} />}
          {activeTab === 'users' && <DashUserManagement />}
          {activeTab === 'devices' && <DashDeviceMangement />}
          {activeTab === 'reports' && <DashReports />}
          {activeTab === 'notifications' && <DashNotifications />}
          {activeTab === 'settings' && <DashSettings />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;