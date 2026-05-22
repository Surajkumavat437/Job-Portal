import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.js";
import ToggleButton from "../ui/ToggleButton.jsx";
import { BriefcaseBusiness } from "lucide-react";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="fixed top-0 left-20 right-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 px-6 flex items-center justify-between transition-colors duration-300">
      {/* Brand Logo */}
      <Link to="/home" className="flex items-center gap-2 font-bold text-xl text-primary">
        <BriefcaseBusiness className="w-6 h-6" />
        <span>Job<span className="text-foreground">Portal</span></span>
      </Link>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* User Greeting (Hidden on login/landing if unauthenticated) */}
        {isAuthenticated && user && (
          <span className="hidden sm:inline text-sm font-medium text-muted-foreground">
            Hi, <span className="text-foreground font-semibold">{user.name}</span>
          </span>
        )}

        {/* Global Theme Toggle Button */}
        <ToggleButton />
      </div>
    </header>
  );
};

export default Navbar;