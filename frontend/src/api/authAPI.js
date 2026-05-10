import API from "./axios";

export const loginUSer = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);
export const getCurrentUser = () => API.get("/user/me");