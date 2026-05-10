import API from "./axios.js";

const getJob = async(params)=>{
    const response = await API.get("/jobs", {params});
    return response.data;
}

export default getJob;