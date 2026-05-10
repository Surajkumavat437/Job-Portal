import application from "../models/application.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";
import job from "../models/job.model.js";

export const applyToJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "wrong Job ID");
  }

  const jobData = await job.findById(id);

  if (!jobData) {
    throw new ApiError(404, "Job details not Found");
  }

  const data = await application.create({
    job: id,
    applicant: req.user.id,
  });

  return res.status(201).json({
    success: true,
    message: "Application created successfully",
    data,
  });
};

export const myApplications = async (req, res) => {
  const allApplication = await application
    .find({ applicant: req.user.id })
    .populate("job");
  res.status(200).json({
    success: true,
    message: "All the Applied Jobs list",
    data: allApplication,
  });
};

export const getApplicationsForJob = async (req, res) => {
  const { jobId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid Job ID");
  }

  const jobData = await job.findById(jobId);

  if (!jobData) {
    throw new ApiError(404, "Job not Found");
  }

  if (jobData.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized to view applicants");
  }

  const applications = await application
    .find({ job: jobId })
    .populate("applicant", "name email");

  return res.status(200).json({
    success: true,
    message: "Applicants fetched successfully",
    data: applications,
  });
};

export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid Application ID");
  }

  const allowedStatus = ["applied", "reviewed", "accepted", "rejected"];

  if(!allowedStatus.includes(status)){
    throw new ApiError(400, "Invalid status value");
  }

  const applicationData  = await application.findById(id);

  if(!applicationData){
    throw new ApiError(404, "Application not found");
  }

  const jobData = await job.findById(applicationData.job);

  if(!jobData){
    throw new ApiError(404, "Job not found");
  }

  if(jobData.createdBy.toString() !== req.user.id){
    throw new ApiError(403, "Not authorized to update status");
  }

  applicationData.status = status;
  await applicationData.save();

 return res.status(200).json({
    success: true,
    message: "Application status updated",
    data: applicationData,
  });
};
