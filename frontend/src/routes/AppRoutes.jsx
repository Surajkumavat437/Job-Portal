import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";

import Home from "../pages/jobseeker/Home";
import Applications from "../pages/jobseeker/Applications";
import Dashboard from "../pages/jobseeker/Dashboard";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Auth pages (NO sidebar/layout) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Pages WITH sidebar/layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;