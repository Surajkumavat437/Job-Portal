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
    const { email, password } = req.body;

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

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
    );

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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