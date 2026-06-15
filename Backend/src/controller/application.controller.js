import application from "../models/application.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";
import job from "../models/job.model.js";
import Profile from "../models/profile.model.js";

// ─── Allowed status values (must stay in sync with application.model.js enum) ──
const ALLOWED_STATUSES = ["applied", "reviewed", "selected", "rejected"];

// ─── APPLY TO JOB ──────────────────────────────────────────────────────────────
export const applyToJob = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const jobData = await job.findById(id);
    if (!jobData) {
        throw new ApiError(404, "Job not found");
    }

    const applicantId = req.user.id;

    // Guard: applicant must have a completed profile before applying
    const studentProfile = await Profile.findOne({ user: applicantId });
    if (!studentProfile) {
        throw new ApiError(
            400,
            "Please complete your professional profile (resume, skills, bio) before applying to jobs."
        );
    }

    // Guard: prevent duplicate applications (belt-and-suspenders alongside the DB unique index)
    const alreadyApplied = await application.findOne({ job: id, applicant: applicantId });
    if (alreadyApplied) {
        throw new ApiError(409, "You have already submitted an application for this position.");
    }

    const data = await application.create({
        job: id,
        applicant: applicantId,
        profile: studentProfile._id,
    });

    return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data,
    });
};

// ─── MY APPLICATIONS ───────────────────────────────────────────────────────────
export const myApplications = async (req, res) => {
    const applicantId = req.user.id;

    const allApplication = await application
        .find({ applicant: applicantId })
        .populate("job");

    res.status(200).json({
        success: true,
        message: "Applications fetched successfully",
        data: allApplication,
    });
};

// ─── GET APPLICATIONS FOR JOB ──────────────────────────────────────────────────
export const getApplicationsForJob = async (req, res) => {
    const { jobId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const jobData = await job.findById(jobId);
    if (!jobData) {
        throw new ApiError(404, "Job not found");
    }

    // Security: IDOR prevention — verify the recruiter owns this job before exposing applicants
    if (jobData.createdBy.toString() !== req.user.id) {
        throw new ApiError(403, "Not authorised to view applicants for this job");
    }

    // Security: only select fields needed by the frontend — do not expose password or role
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

// ─── UPDATE APPLICATION STATUS ─────────────────────────────────────────────────
export const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid Application ID");
    }

    // Security: whitelist-validate status to prevent arbitrary values being written to DB
    if (!status || !ALLOWED_STATUSES.includes(status)) {
        throw new ApiError(
            400,
            `Invalid status. Allowed values are: ${ALLOWED_STATUSES.join(", ")}`
        );
    }

    const applicationData = await application.findById(id);
    if (!applicationData) {
        throw new ApiError(404, "Application not found");
    }

    const jobData = await job.findById(applicationData.job);
    if (!jobData) {
        throw new ApiError(404, "Associated job not found");
    }

    // Security: IDOR prevention — verify the recruiter owns the job before mutating the application
    if (jobData.createdBy.toString() !== req.user.id) {
        throw new ApiError(403, "Not authorised to update status for this application");
    }

    applicationData.status = status;
    await applicationData.save();

    return res.status(200).json({
        success: true,
        message: `Application status updated to ${status}`,
        data: applicationData,
    });
};