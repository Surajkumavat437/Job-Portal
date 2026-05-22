import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; 
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  Menu,
  ChevronLeft,
  LogOut, 
  Settings,
  Bookmark, // 🌟 1. IMPORTED THE BOOKMARK ICON
} from "lucide-react";
import { useAuth } from "../../context/AuthContext"; 

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  //  2. ADDED "Saved Jobs" ROUTE HERE (Only visible to Job Seekers)
  const seekerItems = [
    { name: "Jobs", path: "/home", icon: Briefcase },
    { name: "Applications", path: "/applications", icon: FileText },
    { name: "Saved Jobs", path: "/saved-jobs", icon: Bookmark }, 
    { name: "Profile", path: "/dashboard", icon: LayoutDashboard },
    
  ];

  const recruiterItems = [
    { name: "Admin Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Post a Job", path: "/admin/post-job", icon: Briefcase },
    { name: "Manage Companies", path: "/admin/companies", icon: FileText },
  ];

  const navItems = user?.role === "recruiter" ? recruiterItems : seekerItems;

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
              <item.icon 
                size={20} 
                className={`shrink-0 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`} 
              />
              <span
                className={`ml-3 font-medium transition-all duration-300 overflow-hidden whitespace-nowrap
                ${isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
              >
                {item.name}
              </span>
              {isActive && isOpen && (
                <div className="absolute right-2 w-1 h-4 bg-primary rounded-full animate-in fade-in zoom-in" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. BOTTOM SECTION (Logout, Settings & Profile Card) */}
      <div className="mt-auto border-t border-sidebar-border p-3 space-y-2">
        
        {/* LOGOUT BUTTON */}
        <button
          type="button"
          onClick={handleLogout}
          className={`group flex items-center h-10 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-500/10 cursor-pointer
            ${isOpen ? "px-3 mx-1 w-full" : "justify-center mx-auto w-12"}
          `}
        >
          <LogOut size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
          {isOpen && (
            <span className="ml-3 font-medium animate-in fade-in slide-in-from-left-2">
              Logout
            </span>
          )}
        </button>

        {/* Subtle spacing spacer block */}
        <div className="pt-1"></div>

        {/* USER PROFILE INFO DISPLAYER */}
        <div className={`flex items-center ${isOpen ? "justify-between px-1" : "justify-center"}`}>
           {isOpen && (
             <div className="flex items-center gap-2 animate-in fade-in duration-500">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                  {user?.name?.[0] || "U"}
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-bold text-sidebar-foreground truncate w-24">{user?.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{user?.role?.replace('_', ' ')}</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;