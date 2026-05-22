import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx"; // Import your new global Navbar

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  // Define paths where you absolutely do NOT want the Sidebar to show
  const noSidebarPaths = ["/", "/login"];
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col transition-colors duration-300">
      
      {/* Global Navbar - stays fixed at the top of every page */}
      <Navbar />

      {/* Main Layout Body wrapper (pt-16 compensates for the fixed Navbar height) */}
      <div className="flex flex-1 pt-16 relative">
        
        {/* Conditionally render Sidebar based on active route */}
        {showSidebar && (
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        )}

        {/* Main Content Pane */}
        <div
          className={`w-full min-h-screen p-6 transition-all duration-300 ease-in-out
          ${showSidebar ? (isOpen ? "ml-64" : "ml-20") : "ml-0"}`}
        >
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Layout;