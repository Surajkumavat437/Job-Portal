import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

// ─── GET CURRENT USER ──────────────────────────────────────────────────────────
export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Security: exclude password field from the response
    const user = await User.findById(userId)
        .select("-password")
        .populate("savedJobs");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});

// ─── GET USER PROFILE ──────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
        throw new ApiError(404, "Profile not found");
    }

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: profile,
    });
});

// ─── UPDATE USER PROFILE ────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Security: explicitly whitelist only the fields that are allowed to be updated.
    // Using spread on req.body without a whitelist would allow a malicious client to
    // inject arbitrary fields (e.g., "user" to change profile ownership).
    const { bio, skills, experience, education, resume } = req.body;

    // Security: validate resume URL format when provided — must be a cloudinary https URL
    if (resume !== undefined && resume !== "") {
        const isValidUrl =
            typeof resume === "string" &&
            resume.startsWith("https://") &&
            resume.length <= 2000;
        if (!isValidUrl) {
            throw new ApiError(400, "Resume must be a valid HTTPS URL");
        }
    }

    // Security: validate skills is an array of non-empty strings when provided
    if (skills !== undefined) {
        if (!Array.isArray(skills)) {
            throw new ApiError(400, "Skills must be an array of strings");
        }
        if (skills.some((s) => typeof s !== "string" || s.trim().length === 0)) {
            throw new ApiError(400, "Each skill must be a non-empty string");
        }
    }

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
        profile = await Profile.create({
            user: userId,
            bio: bio ? String(bio).trim() : undefined,
            skills: skills || [],
            experience: experience ? String(experience).trim() : undefined,
            education: education ? String(education).trim() : undefined,
            resume: resume || undefined,
        });
    } else {
        if (bio !== undefined) profile.bio = String(bio).trim();
        if (skills !== undefined) profile.skills = skills;
        if (experience !== undefined) profile.experience = String(experience).trim();
        if (education !== undefined) profile.education = String(education).trim();
        if (resume !== undefined) profile.resume = resume;

        await profile.save();
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
    });
});

// ─── TOGGLE SAVE / UNSAVE A JOB ───────────────────────────────────────────────
export const toggleSaveJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params;
    const userId = req.user.id;

    // Security: validate that jobId is a valid ObjectId to prevent injection
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isAlreadySaved = user.savedJobs.includes(jobId);

    if (isAlreadySaved) {
        user.savedJobs.pull(jobId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Job removed from bookmarks.",
            isSaved: false,
        });
    } else {
        user.savedJobs.push(jobId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Job saved to bookmarks.",
            isSaved: true,
        });
    }
});

// ─── GET ALL SAVED JOBS ────────────────────────────────────────────────────────
export const getSavedJobs = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const userWithBookmarks = await User.findById(userId).populate({
        path: "savedJobs",
        options: { sort: { createdAt: -1 } },
    });

    if (!userWithBookmarks) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json({
        success: true,
        message: "Saved jobs fetched successfully",
        data: userWithBookmarks.savedJobs || [],
    });
});