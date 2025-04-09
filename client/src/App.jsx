import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';

import './App.css'
import AdminDashboard from "./Pages/AdminDashboard";
import NetworkEngineerDashboard from './Pages/NetworkEngineerDashboard';

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={"/admin-dashboard"}/>}/>
      <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
      <Route path="/network-dashboard" element={<NetworkEngineerDashboard/>}/>


    </Routes>

    </BrowserRouter>
  );
}

export default App
