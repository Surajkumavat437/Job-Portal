import { createContext, useContext } from "react";

// The "Radio Station"
export const AuthContext = createContext();

// The "Listener" (Hook)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};