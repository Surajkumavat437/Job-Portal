import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// ─── Shared secure cookie options ──────────────────────────────────────────────
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    // 🌟 FIX: Shifted from 'strict' to 'lax' so local cross-port architectures (5173 -> 3000) pass cookies cleanly
    sameSite: "none", 
    maxAge: 60 * 60 * 1000, // 1 hour
};

// ─── Token Helper ─────────────────────────────────────────────────────────────
const generateAndSendToken = (user, statusCode, res, message) => {
    if (!process.env.SECRET_KEY) {
        throw new ApiError(500, "Server configuration error: SECRET_KEY missing");
    }

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, COOKIE_OPTIONS);

    return res.status(statusCode).json({
        success: true,
        message,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password) => password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password);

// ─── REGISTER (Now fully authenticates on submission!) ───────────────────────
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        throw new ApiError(400, "All fields are required");
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
        throw new ApiError(400, "Name cannot be blank");
    }
    if (!isValidEmail(trimmedEmail)) {
        throw new ApiError(400, "Invalid email format");
    }
    if (!isStrongPassword(password)) {
        throw new ApiError(400, "Password must be at least 8 characters and contain at least one letter and one digit");
    }

    const allowedRoles = ["job_seeker", "recruiter"];
    if (!allowedRoles.includes(role)) {
        throw new ApiError(400, "Invalid role");
    }

    const exists = await User.findOne({ email: trimmedEmail });
    if (exists) {
        throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
        name: trimmedName,
        email: trimmedEmail,
        password: hashedPassword,
        role,
    });

    // 🌟 THE CRITICAL SIGNUP FIX: Automatically drop the session cookie right here!
    return generateAndSendToken(newUser, 201, res, "User registered and logged in successfully");
});

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Please provide email and password");
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
        throw new ApiError(400, "Invalid email format");
    }

    const user = await User.findOne({ email: trimmedEmail });
    const dummyHash = "$2b$12$invalidhashplaceholderXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
    const match = await bcrypt.compare(password, user ? user.password : dummyHash);

    if (!user || !match) {
        throw new ApiError(401, "Invalid email or password");
    }

    if (role && user.role !== role) {
        throw new ApiError(401, "Invalid email or password");
    }

    return generateAndSendToken(user, 200, res, "Login successful");
});

// ─── LOGOUT ────────────────────────────────────────────────────────────────────
export const logout = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .cookie("accessToken", "", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(0),
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
});