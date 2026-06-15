import API from "./axios";

export const loginUser = async (data) => {
    const response = await API.post("/auth/login", data);
    return response.data; 
};

export const registerUser = async (data) => {
    // 🌟 ARCHITECTURAL ALIGNMENT: Ensures your post route maps precisely to your backend route hook (/api/auth/register)
    const response = await API.post("/auth/register", data);
    return response.data;
};