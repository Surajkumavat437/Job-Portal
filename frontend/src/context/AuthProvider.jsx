import { useState, useEffect, useCallback, useRef } from "react";
import { authAPI } from "../api/authAPI";
import { AuthContext } from "./AuthContext"; // Import from the other file

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const hasChecked = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response?.data?.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
        console.log(error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const init = async () => {
      await checkAuth();
    };
    init();
  }, [checkAuth]);

  const logout = async () => {
    try {
      await authAPI.logoutUser();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value = { user, isAuthenticated, loading, checkAuth, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : (
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};