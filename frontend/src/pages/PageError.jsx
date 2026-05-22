import React from "react";
import { Link } from "react-router-dom";

// Ensure the component name is capitalized
const PageError = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background text-foreground p-6 text-center">
      <div className="max-w-md p-8 bg-card rounded-[2.5rem] border border-border shadow-xl">
        <h1 className="text-7xl font-black text-primary tracking-tight mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2 text-card-foreground">Page Not Found</h2>
        <p className="text-muted-foreground text-sm mb-6">
          The link you followed might be broken, or the page may have been moved.
        </p>
        <Link 
          to="/login" 
          className="inline-flex items-center justify-center px-6 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer"
        >
          Back to Safety
        </Link>
      </div>
    </div>
  );
};

export default PageError;