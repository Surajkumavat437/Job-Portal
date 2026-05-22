import { useContext } from "react";
// Point this to the ThemeContextInstance file
import { ThemeContext } from "../context/ThemeContextInstance.js";

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};