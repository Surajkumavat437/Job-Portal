import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex bg-background text-foreground min-h-screen">

      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div
        className={`w-full min-h-screen p-4 transition-all duration-300 ease-in-out
        ${isOpen ? "ml-64" : "ml-20"}`}
      >
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;