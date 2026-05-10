import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ToggleButton = () => {
  const [dark, setDark] = useState(true);

  // sync with DOM
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative w-14 h-7 bg-muted border border-black rounded-full flex items-center px-1 transition"
    >
      {/* ICON SLIDER */}
      <div
        className={`absolute top-1 left-1 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300
        ${dark ? "translate-x-7 bg-primary" : "translate-x-0 bg-background"}`}
      >
        {dark ? (
          <Moon size={12} className="text-primary-foreground" />
        ) : (
          <Sun size={12} className="text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ToggleButton;