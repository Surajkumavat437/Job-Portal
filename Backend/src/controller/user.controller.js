import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// 1. GET CURRENT USER (UPDATED WITH POPULATE)
export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // 🌟 FIXED HERE: Added .populate("savedJobs") so the frontend knows what is bookmarked on login
    const user = await User.findById(userId)
        .select("-password")
        .populate("savedJobs");

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});

// 2. GET USER PROFILE
export const getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
        throw new ApiError(404, "Profile Not Found");
    }

    res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        data: profile,
    });
});

// 3. UPDATE USER PROFILE
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { bio, skills, experience, education, resume} = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
        profile = await Profile.create({
            user: userId,
            bio,
            skills,
            experience,
            education,
            resume,
        });
    } 
    else {
        if (bio) profile.bio = bio;
        if (skills) profile.skills = skills;
        if (experience) profile.experience = experience;
        if (education) profile.education = education;
        if (resume) profile.resume = resume;

        await profile.save();
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
    });
});

// 4. TOGGLE SAVE / UNSAVE A JOB LISTING
export const toggleSaveJob = asyncHandler(async (req, res) => {
    const { id: jobId } = req.params; 
    const userId = req.user.id;      

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User profile identity context not found.");
    }

    const isAlreadySaved = user.savedJobs.includes(jobId);

    if (isAlreadySaved) {
        user.savedJobs.pull(jobId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Job position successfully removed from bookmarks.",
            isSaved: false,
        });
    } else {
        user.savedJobs.push(jobId);
        await user.save();

        res.status(200).json({
            success: true,
            message: "Job position pinned to your saved bookmarks successfully!",
            isSaved: true,
        });
    }
});

// 5. GET ALL BOOKMARKED JOBS
export const getSavedJobs = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const userWithBookmarks = await User.findById(userId).populate({
        path: "savedJobs",
        options: { sort: { createdAt: -1 } } 
    });

    if (!userWithBookmarks) {
        throw new ApiError(404, "User session state not found.");
    }

    res.status(200).json({
        success: true,
        message: "Saved job pipeline collections parsed successfully.",
        data: userWithBookmarks.savedJobs || [],
    });
});