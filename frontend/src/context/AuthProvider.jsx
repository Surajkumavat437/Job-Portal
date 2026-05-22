import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as authAPI from "../api/userApi.js";
import Spinner from '../components/ui/Spinner.jsx';
import { AuthContext } from './AuthContext.js';

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const hasChecked = useRef(false);

    // 🔄 Auto-verify active session cookie/token on page reload
    const checkAuth = useCallback(async () => {
        try {
            setLoading(true);
            const response = await authAPI.getUser();
            
            // 🚀 Handle both common nested API structural variants cleanly
            const coreUser = response?.data?.data || response?.data || response;
            
            if (coreUser && coreUser.role) {
                setUser(coreUser);
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error(err)
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (hasChecked.current) return;
        hasChecked.current = true;
        checkAuth();
    }, [checkAuth]);

    // 🔑 Handle programmatic frontend user login updates
    const login = (userData) => {
        // Unpack payload variations symmetrically with the checkAuth engine setup
        const coreUser = userData?.data?.data || userData?.data || userData;
        
        if (coreUser && coreUser.role) {
            setUser(coreUser);
            setIsAuthenticated(true);
        }
    };

    // 🚪 Wipe local authentication state instantly
    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = { 
        user, 
        isAuthenticated, 
        loading, 
        checkAuth, 
        login, 
        logout 
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading ? children : (
                <div className="h-screen w-full flex items-center justify-center bg-background select-none animate-in fade-in duration-200">
                    <Spinner />
                </div>
            )}
        </AuthContext.Provider>
    );
};

export default AuthProvider;