import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        throw new ApiError(400, "All fields are required");
    }

    const allowedRoles = ["job_seeker", "recruiter"];

    if (!allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid Role");
    }

    const exists = await User.findOne({ email });

    if (exists) {
        throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        },
    });
});

export const login = asyncHandler(async (req, res) => {
    // 🌟 1. EXTRACT THE SELECTED ROLE FROM THE FRONTEND REQUEST
    const { email, password, role } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please fill all fields");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new ApiError(401, "Invalid email or password");
    }

    // 🌟 2. STRICT SECURITY VERIFICATION: Verify selected role matches database reality
    if (role && user.role !== role) {
        const formattedRole = user.role.replace('_', ' '); // Converts "job_seeker" -> "job seeker"
        throw new ApiError(403, `Access denied. Your profile is registered as a ${formattedRole}.`);
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

export const logout = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .cookie("accessToken", "", { 
            httpOnly: true, 
            secure: false, 
            sameSite: "strict",
            expires: new Date(0) 
        })
        .json({ 
            success: true, 
            message: "Logged out successfully" 
        });
});