//import React from 'react'
import { ToastContainer } from "react-toastify";
import { Routes, Route } from 'react-router-dom'
//import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
//import ProtectedRoute from "./components/ProtectedRoute";
import Home from './pages/Home'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import DashboardAdmin from './pages/DashboardAdmin'
import DashboardGuide from './pages/DashboardGuide'
import DashboardStudent from './pages/DashboardStudent'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-guide" element={<DashboardGuide />} />
        <Route path="/dashboard-student" element={<DashboardStudent />} />
        {/* Public Routes
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        Protected Routes Based on Role 
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["guide"]} />}>
          <Route path="/dashboard-guide" element={<DashboardGuide />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard-student" element={<DashboardStudent />} />
        </Route>

        Catch-all Route to Redirect Unauthorized Users 
        <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </div>
  );
}

export default App