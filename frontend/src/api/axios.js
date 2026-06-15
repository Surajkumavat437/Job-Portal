import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true, // Tells axios to send cookies cross-origin
});

// 🌟 THE BULLETPROOF FIX: Force your browser's global network layer to always permit cross-domain credentials
API.interceptors.request.use(
    (config) => {
        config.withCredentials = true;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;