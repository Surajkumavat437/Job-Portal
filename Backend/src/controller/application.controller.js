import application from "../models/application.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";
import job from "../models/job.model.js";
import Profile from "../models/profile.model.js"; // 🌟 Added import for Profile model

export const applyToJob = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "wrong Job ID");
  }

  const jobData = await job.findById(id);

  if (!jobData) {
    throw new ApiError(404, "Job details not Found");
  }

  // Safe fallback to check both token assignment structures (.id or ._id)
  const applicantId = req.user.id || req.user._id;

  // 1. 🌟 Guard: Look up the student's profile before allowing them to apply
  const studentProfile = await Profile.findOne({ user: applicantId });

  if (!studentProfile) {
    throw new ApiError(
      400,
      "Please complete your professional profile (resume, skills, bio) before applying to jobs."
    );
  }

  // 2. Guard: Programmatically catch double application submissions
  const alreadyApplied = await application.findOne({ job: id, applicant: applicantId });
  if (alreadyApplied) {
    throw new ApiError(400, "You have already submitted an application for this position.");
  }

  // 3. 🚀 Create the application with the explicit profile ID saved directly!
  const data = await application.create({
    job: id,
    applicant: applicantId,
    profile: studentProfile._id, // 🌟 Saved straight to the database layout
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
    .populate("applicant", "name email")
    .populate("profile", "bio skills experience education resume"); 

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

  // 🌟 Updated validation array to use clean, streamlined hiring stages:
  const allowedStatus = ["applied", "reviewed", "selected", "rejected"];

  if (!allowedStatus.includes(status)) {
    throw new ApiError(400, `Invalid status option. Allowed choices are: ${allowedStatus.join(", ")}`);
  }

  const applicationData = await application.findById(id);

  if (!applicationData) {
    throw new ApiError(404, "Application not found");
  }

  const jobData = await job.findById(applicationData.job);

  if (!jobData) {
    throw new ApiError(404, "Job not found");
  }

  // Verify that the logged-in user is actually the recruiter who created this job posting
  if (jobData.createdBy.toString() !== req.user.id) {
    throw new ApiError(403, "Not authorized to update status for this pipeline");
  }

  // Apply update and write cleanly to MongoDB collection
  applicationData.status = status;
  await applicationData.save();

  return res.status(200).json({
    success: true,
    message: `Application stage updated successfully to ${status}`,
    data: applicationData,
  });
};