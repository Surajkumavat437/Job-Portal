import { createContext, useContext } from "react";

// The Bucket
export const AuthContext = createContext(); 

// The Faucet (Custom Hook)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};