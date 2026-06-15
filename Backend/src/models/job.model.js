import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
            // Security: cap length to prevent oversized payloads being stored permanently
            maxlength: [150, "Title must be 150 characters or fewer"],
        },
        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
            // Security: prevent absurdly large text blobs from being persisted
            maxlength: [5000, "Description must be 5000 characters or fewer"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
            maxlength: [200, "Location must be 200 characters or fewer"],
        },
        salary: {
            type: Number,
            required: [true, "Salary is required"],
            // Security: enforce non-negative salary at schema level as a second line of defence
            min: [0, "Salary must be a non-negative number"],
            // Security: cap unrealistically large salary values
            max: [100_000_000, "Salary exceeds the maximum allowed value"],
        },
        companyName: {
            type: String,
            trim: true,
            maxlength: [200, "Company name must be 200 characters or fewer"],
        },
        jobType: {
            type: String,
            // Security: enum whitelist enforced at schema level — any value not in this
            // list will trigger a Mongoose ValidationError before data is written to MongoDB
            enum: {
                values: ["full-time", "part-time", "internship"],
                message: "Job type must be one of: full-time, part-time, internship",
            },
            default: "full-time",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Job must be associated with a recruiter account"],
        },
    },
    {
        timestamps: true,
    }
);

// Performance: index on createdBy for fast recruiter dashboard queries
jobSchema.index({ createdBy: 1, createdAt: -1 });

// Performance: index on jobType + location for common filter queries
jobSchema.index({ jobType: 1, location: 1 });

const job = mongoose.model("Job", jobSchema);

export default job;