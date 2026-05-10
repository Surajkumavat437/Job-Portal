import API from "./axios.js";

const getUser = async()=>{
    const user = await API.get("/user/me");
    return user.data;
}

export default getUser;