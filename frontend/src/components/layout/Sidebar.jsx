import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Menu,
  ChevronLeft,
} from "lucide-react";
import ToggleButton from "../ui/ToggleButton.jsx";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  // Function to close sidebar when a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navItems = [
    { name: "Jobs", path: "/", icon: Briefcase },
    { name: "Applications", path: "/applications", icon: FileText },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50 
      transition-all duration-300 ease-in-out shadow-sm
      ${isOpen ? "w-64" : "w-20"}`}
    >
      {/* 1. HEADER SECTION */}
      <div className="flex items-center h-16 px-4 mb-6">
        <div className={`flex items-center w-full ${isOpen ? "justify-between" : "justify-center"}`}>
          {isOpen && (
            <span className="text-xl font-bold tracking-tight text-primary animate-in fade-in duration-300">
              Job<span className="text-sidebar-foreground">Portal</span>
            </span>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-all active:scale-90"
          >
            {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION SECTION */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={handleLinkClick}
              className={`group relative flex items-center h-10 rounded-lg transition-all duration-200
                ${isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
                }
                ${isOpen ? "px-3 mx-1" : "justify-center mx-auto w-12"} 
              `}
            >
              {/* Icon - Stays centered because of the fixed width wrapper when closed */}
              <item.icon 
                size={20} 
                className={`shrink-0 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`} 
              />
              
              {/* Label - Hidden when closed */}
              <span
                className={`ml-3 font-medium transition-all duration-300 overflow-hidden whitespace-nowrap
                ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
              >
                {item.name}
              </span>

              {/* Minimal Active Indicator (Small dot or line) */}
              {isActive && isOpen && (
                <div className="absolute right-2 w-1 h-4 bg-primary rounded-full animate-in fade-in zoom-in" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. BOTTOM SECTION (Toggle Button) */}
      <div className={`mt-auto p-4 flex ${isOpen ? "justify-end" : "justify-center"}`}>
        <div className={`transition-all duration-300 ${isOpen ? "rotate-0" : "scale-90"}`}>
            <ToggleButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;