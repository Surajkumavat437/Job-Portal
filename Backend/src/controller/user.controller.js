import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";


export const getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
    });
});



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



export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { bio, skills, experience, education, resume, profilePhoto } = req.body;

    let profile = await Profile.findOne({ user: userId });

    if (!profile) {
        profile = await Profile.create({
            user: userId,
            bio,
            skills,
            experience,
            education,
            resume,
            profilePhoto,
        });
    } 
   
    else {
        if (bio) profile.bio = bio;
        if (skills) profile.skills = skills;
        if (experience) profile.experience = experience;
        if (education) profile.education = education;
        if (resume) profile.resume = resume;
        if (profilePhoto) profile.profilePhoto = profilePhoto;

        await profile.save();
    }

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: profile,
    });
});