import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx"; 

import Home from "../pages/jobseeker/Home";
import Applications from "../pages/jobseeker/Applications";
import Dashboard from "../pages/jobseeker/Dashboard";
import SavedJobs from "../pages/jobseeker/SavedJobs"; // 🌟 1. IMPORTED NEW SAVED JOBS PAGE
import AdminDashboard from "../pages/recruiter/AdminDashboard.jsx";
import PostJobForm from "../pages/recruiter/PostJobForm.jsx"; 
import JobDetails from "../pages/jobseeker/JobDetails.jsx"; 

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import PageError from "../pages/pageError.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* WRAP EVERYTHING IN THE MASTER LAYOUT FOR THE GLOBAL NAVBAR */}
      <Route element={<Layout />}>
        
        {/* 1. PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 2. JOB SEEKER ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['job_seeker']} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/applications" element={<Applications />} />
          
          {/* 🌟 2. REGISTERED THE ROUTE UNDER JOB SEEKER ENCLAVE PROTECTION */}
          <Route path="/saved-jobs" element={<SavedJobs />} /> 
          
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* 3. RECRUITER ONLY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/post-job" element={<PostJobForm />} />
        </Route>

      </Route>

      {/* 4. FALLBACK: Redirect any unknown routes to login */}
      <Route path="*" element={<PageError />} />
    </Routes>
  );
};

export default AppRoutes;