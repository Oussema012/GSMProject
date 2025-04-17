import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';
import AlertCenter from './components/AlertCenter';
import './App.css';
import AdminDashboard from "./Pages/AdminDashboard";
import NetworkEngineerDashboard from './Pages/NetworkEngineerDashboard';
import NetworkTechnicianDashboard from './Pages/NetworkTechnicianDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/admin-dashboard"}/>}/>
        
        <Route path="/admin-dashboard" element={
          <AdminDashboard>
            <AlertCenter alertLevel="admin" />
          </AdminDashboard>
        }/>
        
        <Route path="/network-dashboard" element={
          <NetworkEngineerDashboard>
            <AlertCenter alertLevel="engineer" />
          </NetworkEngineerDashboard>
        }/>
        
        <Route path="/technician-dashboard" element={
          <NetworkTechnicianDashboard>
            <AlertCenter alertLevel="technician" />
          </NetworkTechnicianDashboard>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;