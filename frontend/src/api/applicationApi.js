import API from "./axios";

export const applyJob = (jobId) =>
  API.post(`/applications/${jobId}`);

export const getMyApplications = () =>
  API.get("/applications/me");

export const getApplicants = (jobId) =>
  API.get(`/applications/job/${jobId}`);

export const updateStatus = (id, status) =>
  API.put(`/applications/${id}/status`, { status });