import React from "react";
import { Sun, Moon } from "lucide-react";
// Change this line to look into your new hooks directory:
import { useTheme } from "../../hooks/useTheme.js"; 

const ToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-secondary hover:bg-muted text-foreground border border-border transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center"
      aria-label="Toggle Layout Theme"
    >
      {theme === "dark" ? (
        <Sun size={18} className="text-amber-500 animate-in fade-in zoom-in duration-300" />
      ) : (
        <Moon size={18} className="text-slate-700 animate-in fade-in zoom-in duration-300" />
      )}
    </button>
  );
};

export default ToggleButton;