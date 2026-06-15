import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import { loginUser, registerUser } from "../../api/authAPI.js";
import { toast } from "react-hot-toast";

import AuthHeroSection from "./components/AuthHeroSection";
import AuthFormCard from "./components/AuthFormCard";

// Security: whitelist of valid roles — prevents a client-side bypass from
// submitting an arbitrary role string to the backend
const ALLOWED_ROLES = ["job_seeker", "recruiter"];

// Security: basic client-side email format check — the backend also validates,
// but this gives immediate UX feedback and reduces unnecessary API calls
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Security: enforce minimum password complexity consistent with the backend rule
const isStrongPassword = (password) =>
    password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);

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

    // Clears field artifacts cleanly when changing login views
    const handleToggleMode = (status) => {
        setIsLogin(status);
        setFormData({ fullName: "", email: "", password: "" });
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        // Security: client-side validation before sending any network request
        const trimmedEmail = formData.email.trim().toLowerCase();

        if (!isValidEmail(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!isLogin && !isStrongPassword(formData.password)) {
            toast.error(
                "Password must be at least 8 characters and contain a letter and a digit."
            );
            return;
        }

        // Security: validate role against the whitelist before sending to backend
        if (!ALLOWED_ROLES.includes(role)) {
            toast.error("Invalid role selected.");
            return;
        }

        setLoading(true);

        try {
            const response = isLogin
                ? await loginUser({ email: trimmedEmail, password: formData.password, role })
                : await registerUser({
                      name: formData.fullName.trim(),
                      email: trimmedEmail,
                      password: formData.password,
                      role,
                  });

            if (response?.success || response?.data) {
                const coreUser = response.data?.data || response.data;
                login(coreUser);
                const userRole = coreUser?.role || role;

                // Security: sanitise the display name to avoid injecting raw API data into JSX.
                // React auto-escapes string interpolation in JSX, but toast.success uses a
                // template string — still safe here because React-Hot-Toast renders it as text.
                const displayName = coreUser?.name
                    ? String(coreUser.name).slice(0, 50)
                    : "User";

                toast.success(`Welcome, ${displayName}!`);
                setFormData({ fullName: "", email: "", password: "" });

                if (userRole === "recruiter") {
                    navigate("/admin/dashboard", { replace: true });
                } else {
                    navigate("/home", { replace: true });
                }
            }
        } catch (error) {
            // Security: only surface the backend's message string — never log or display
            // raw error objects which may contain stack traces or internal API details.
            const safeMessage =
                error.response?.data?.message ||
                "Authentication failed. Please check your credentials.";
            toast.error(safeMessage);
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