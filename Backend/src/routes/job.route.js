import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as job from "../controller/job.controller.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// 1. PUBLIC ROUTES
router.get("/", asyncHandler(job.getJobs));

// 🚀 2. RECRUITER PROTECTED PIPELINE ENDPOINT
// CRITICAL: This must sit ABOVE /:id, otherwise Express will think the word "recruiter" is a job ID!
router.get(
  "/recruiter/jobs", 
  authMiddleware, 
  roleMiddleware("recruiter"), 
  asyncHandler(job.getRecruiterJobsWithApplicants)
);

// 3. MIXED ID PATHS
router.get("/:id", asyncHandler(job.getJobDetail));
router.post("/", authMiddleware, roleMiddleware("recruiter"), asyncHandler(job.createJob));
router.put("/:id", authMiddleware, roleMiddleware("recruiter"), asyncHandler(job.updateJob));
router.delete("/:id", authMiddleware, roleMiddleware("recruiter"), asyncHandler(job.deleteJob));

export default router;