import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            // Security: cap name length to prevent overly large payloads being stored
            maxlength: [100, "Name must be 100 characters or fewer"],
        },
        email: {
            type: String,
            required: true,
            unique: true, 
            lowercase: true,
            trim: true,
            // Security: server-side email format validation as a second line of defence
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
            maxlength: [254, "Email must be 254 characters or fewer"],
        },
        password: {
            type: String,
            required: true,
            // Security: enforce minimum length at schema level
            minlength: [8, "Password must be at least 8 characters"],
        },
        role: {
            type: String,
            enum: ["job_seeker", "recruiter"],
            required: true,
            default: "job_seeker",
        },
        savedJobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;