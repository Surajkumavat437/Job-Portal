import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { loginUser, registerUser } from "../../api/authAPI.js";
import { toast } from "react-hot-toast";

import AuthHeroSection from "./components/AuthHeroSection";
import AuthFormCard from "./components/AuthFormCard";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState("job_seeker");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // State Purifier: Clears field artifacts cleanly when changing login views
  const handleToggleMode = (status) => {
    setIsLogin(status);
    setFormData({ fullName: "", email: "", password: "" });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isLogin
        ? await loginUser({ email: formData.email, password: formData.password, role })
        : await registerUser({ name: formData.fullName, email: formData.email, password: formData.password, role });

      if (response?.success || response?.data) {
        const coreUser = response.data?.data || response.data;
        login(coreUser);
        const userRole = coreUser?.role || role;

        toast.success(`Welcome back, ${coreUser?.name || "User"}!`);
        setFormData({ fullName: "", email: "", password: "" });

        if (userRole === "recruiter") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }
    } catch (error) {
      console.error("Auth layer caught exception:", error);
      toast.error(
        error.response?.data?.message || "Authentication Failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-background text-foreground p-3 md:p-6 overflow-hidden transition-colors duration-300">
      <div className="flex w-full h-full bg-background rounded-[2.5rem] overflow-hidden shadow-2xl border border-border">
        
        {/* Dynamic Marketing Left Sidebar Content */}
        <AuthHeroSection role={role} />

        {/* Dynamic Interactive Input Layer */}
        <AuthFormCard
          isLogin={isLogin}
          setIsLogin={handleToggleMode}
          role={role}
          setRole={setRole}
          loading={loading}
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleAuth}
        />

      </div>
    </div>
  );
};

export default Auth;