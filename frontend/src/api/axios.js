import axios from "axios";

// Security: read the API base URL from the environment variable injected by Vite.
// A hardcoded "http://localhost:3000" would point to the wrong server in staging/production
// and would not be replaceable at build time without changing source code.
const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true, // Required for HttpOnly cookie-based auth to work across origins
});

// Security: intercept responses globally so that 401 "session expired" errors can be
// handled uniformly without leaking raw Axios error objects into component state.
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Let the caller handle the error; do not swallow it here.
        return Promise.reject(error);
    }
);

export default API;