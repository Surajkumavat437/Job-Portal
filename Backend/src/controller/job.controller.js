import job from "../models/job.model.js";
import application from "../models/application.model.js";
import ApiError from "../utils/apiError.js";
import mongoose from "mongoose";
import Profile from "../models/profile.model.js";

// ─── Allowed enum values (must stay in sync with job.model.js) ─────────────────
const ALLOWED_JOB_TYPES = ["full-time", "part-time", "internship"];

// ─── CREATE JOB ────────────────────────────────────────────────────────────────
export const createJob = async (req, res, next) => {
    try {
        const createdBy = req.user?.id;
        const { title, description, location, salary, companyName, jobType } = req.body;

        if (!title || !description || !location || salary === undefined) {
            return next(new ApiError(400, "All required fields must be provided"));
        }

        // Security: validate and coerce salary — reject NaN and negative values
        const parsedSalary = Number(salary);
        if (!Number.isFinite(parsedSalary) || parsedSalary < 0) {
            return next(new ApiError(400, "Salary must be a valid non-negative number"));
        }

        // Security: whitelist jobType to prevent arbitrary values being stored
        const resolvedJobType = ALLOWED_JOB_TYPES.includes(jobType) ? jobType : "full-time";

        // Security: sanitise text strings — strip leading/trailing whitespace
        const newJob = await job.create({
            title: String(title).trim(),
            description: String(description).trim(),
            location: String(location).trim(),
            salary: parsedSalary,
            companyName: companyName ? String(companyName).trim() : undefined,
            jobType: resolvedJobType,
            createdBy,
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            data: newJob,
        });
    } catch (error) {
        return next(error);
    }
};

// ─── GET JOBS (Public, paginated, filtered) ────────────────────────────────────
export const getJobs = async (req, res, next) => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 5));
        const filter = {};
        const allowedSort = ["salary", "createdAt"];

        let sortBy = req.query.sort || "-createdAt";
        if (!allowedSort.includes(sortBy.replace("-", ""))) {
            sortBy = "-createdAt";
        }

        if (req.query.location) {
            filter.location = String(req.query.location).trim();
        }

        if (req.query.jobType) {
            if (ALLOWED_JOB_TYPES.includes(req.query.jobType)) {
                filter.jobType = req.query.jobType;
            }
        }

        if (req.query.salary) {
            const salaryFilter = Number(req.query.salary);
            if (Number.isFinite(salaryFilter)) {
                filter.salary = salaryFilter;
            }
        }

        if (req.query.search) {
            const rawSearch = String(req.query.search).trim();
            if (rawSearch.length > 0 && rawSearch.length <= 100) {
                const escaped = rawSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                filter.title = {
                    $regex: escaped,
                    $options: "i",
                };
            }
        }

        const skip = (page - 1) * limit;

        const [allJobs, totalJobs] = await Promise.all([
            job.find(filter).sort(sortBy).skip(skip).limit(limit),
            job.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(totalJobs / limit);

        return res.status(200).json({
            success: true,
            page,
            totalPages,
            totalJobs,
            data: allJobs,
        });
    } catch (error) {
        return next(error);
    }
};

// ─── GET JOB DETAIL ────────────────────────────────────────────────────────────
export const getJobDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid Job ID"));
        }

        const findJob = await job.findById(id);

        if (!findJob) {
            return next(new ApiError(404, "Job not found"));
        }

        return res.status(200).json({
            success: true,
            message: "Job detail fetched successfully",
            data: findJob,
        });
    } catch (error) {
        return next(error);
    }
};

// ─── UPDATE JOB ────────────────────────────────────────────────────────────────
export const updateJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid Job ID"));
        }

        const jobData = await job.findById(id);

        if (!jobData) {
            return next(new ApiError(404, "Job not found"));
        }

        if (jobData.createdBy.toString() !== req.user.id) {
            return next(new ApiError(403, "Forbidden"));
        }

        const { title, description, location, salary, companyName, jobType } = req.body;

        if (title) jobData.title = String(title).trim();
        if (description) jobData.description = String(description).trim();
        if (location) jobData.location = String(location).trim();

        if (salary !== undefined) {
            const parsedSalary = Number(salary);
            if (!Number.isFinite(parsedSalary) || parsedSalary < 0) {
                return next(new ApiError(400, "Salary must be a valid non-negative number"));
            }
            jobData.salary = parsedSalary;
        }

        if (companyName) jobData.companyName = String(companyName).trim();

        if (jobType && ALLOWED_JOB_TYPES.includes(jobType)) {
            jobData.jobType = jobType;
        }

        await jobData.save();

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            data: jobData,
        });
    } catch (error) {
        return next(error);
    }
};

// ─── DELETE JOB ────────────────────────────────────────────────────────────────
export const deleteJob = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError(400, "Invalid Job ID"));
        }

        const jobData = await job.findById(id);

        if (!jobData) {
            return next(new ApiError(404, "Job not found"));
        }

        if (jobData.createdBy.toString() !== req.user.id) {
            return next(new ApiError(403, "Forbidden"));
        }

        await jobData.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully",
        });
    } catch (error) {
        return next(error);
    }
};

// ─── GET RECRUITER JOBS WITH APPLICANTS ───────────────────────────────────────
export const getRecruiterJobs = async (req, res, next) => {
    try {
        const recruiterId = req.user?.id;

        if (!recruiterId) {
            return next(new ApiError(401, "Unauthorized access profile configuration mismatch."));
        }

        const currentJobs = await job.find({ createdBy: recruiterId }).lean();

        if (!currentJobs || currentJobs.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No jobs found for this recruiter account",
                data: [],
            });
        }

        const jobIds = currentJobs.map((j) => j._id);

        const allApplications = await application
            .find({ job: { $in: jobIds } })
            .populate("applicant", "name email")
            .populate("profile", "bio skills experience education resume")
            .lean();

        const formattedJobsWithApplicants = currentJobs.map((singleJob) => {
            const matchPool = allApplications.filter(
                (app) => app.job && String(app.job) === String(singleJob._id)
            );

            return {
                ...singleJob,
                applications: matchPool.map((app) => ({
                    applicationId: app._id,
                    status: app.status || "applied",
                    appliedAt: app.createdAt,
                    jobSeeker: {
                        _id: app.applicant?._id,
                        name: app.applicant?.name || "Anonymous Applicant",
                        email: app.applicant?.email || "N/A",
                        profile: app.profile || {
                            bio: "",
                            skills: [],
                            experience: "",
                            education: "",
                            resume: "",
                        },
                    },
                })),
            };
        });

        return res.status(200).json({
            success: true,
            message: "Recruiter pipelines loaded successfully",
            data: formattedJobsWithApplicants,
        });

    } catch (error) {
        return next(error);
    }
};