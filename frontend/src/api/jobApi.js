import API from "./axios.js";

export const getJobs = async(params)=>{
    const response = await API.get("/jobs", {params});
    return response.data;
}


export const getRecruiterPipelines = async () => {
    try {
        const response = await API.get("/jobs/recruiter/jobs");
        return response.data; // Expected output shape: { success: true, data: [...] }
    } catch (error) {
        console.error("Failed to compile recruiter pipelines:", error);
        throw error;
    }
};

// 🌟 UPDATED PATH TO PLURAL TO MATCH YOUR EXPRESS ROUTER MOUNT POINT:
export const updateApplicationStatusApi = async (applicationId, status) => {
    try {
        if (!applicationId) {
            console.error("Missing application ID token inside API request method.");
            return;
        }

        // Changed "/application" ➔ "/applications" ✅
        const response = await API.put(`/applications/${applicationId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Failed to update application status:", error);
        throw error;
    }
};

export const createJobApi = async (jobData) => {
    try {
        // Matches your backend route: POST /api/jobs
        const response = await API.post("/jobs", jobData);
        return response.data; // Expected format: { success: true, data: {...} }
    } catch (error) {
        console.error("Failed to post a new position:", error);
        throw error;
    }
};

// Append these inside your frontend/src/api/jobApi.js file:

// 1. DELETE JOB PIPELINE FUNCTION
export const deleteJobApi = async (jobId) => {
  try {
    const response = await API.delete(`/jobs/${jobId}`);
    return response.data; // Expected response context: { success: true, message: "..." }
  } catch (error) {
    console.error("Error context during job execution removal:", error);
    throw error;
  }
};

// 2. UPDATE JOB DETAILS FUNCTION
export const updateJobApi = async (jobId, updatedPayload) => {
  try {
    const response = await API.put(`/jobs/${jobId}`, updatedPayload);
    return response.data; // Expected response context: { success: true, data: {...} }
  } catch (error) {
    console.error("Error context during job profile modification execution:", error);
    throw error;
  }
};