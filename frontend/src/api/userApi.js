import API from "./axios.js";

export const getUser = async()=>{
    const user = await API.get("/user/me");
    return user.data;
}


export const logoutUser = async () => {
    try {
        const response = await API.post("/auth/logout");
        return response.data;
    } catch (error) {
        console.error("API Layer Error: Logout failed");
        throw new Error(error.response?.data?.message || "Logout failed");
    }
};