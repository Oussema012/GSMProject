import React from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom';

import './App.css'
import AdminDashboard from "./Pages/AdminDashboard";

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={"/admin-dashboard"}/>}/>
      <Route path="/admin-dashboard" element={<AdminDashboard/>}/>


    </Routes>

    </BrowserRouter>
  );
}

export default App
