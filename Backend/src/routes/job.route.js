import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
// 🌟 CRITICAL FIX: Point to the correct folder and file path!
import authMiddleware from "../middleware/auth.middleware.js";
import * as job from "../controller/job.controller.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// 1. PUBLIC ROUTES
router.get("/", asyncHandler(job.getJobs));

// 🚀 2. RECRUITER PROTECTED PIPELINE ENDPOINT
router.get(
  "/recruiter/jobs", 
  authMiddleware, 
  roleMiddleware("recruiter"), 
  asyncHandler(job.getRecruiterJobs) // 🌟 MATCHED NAME: Points cleanly to your controller function
);

// 3. MIXED ID PATHS
router.get("/:id", asyncHandler(job.getJobDetail));
router.post("/", authMiddleware, roleMiddleware("recruiter"), asyncHandler(job.createJob));
router.put("/:id", authMiddleware, roleMiddleware("recruiter"), asyncHandler(job.updateJob));
router.delete("/:id", authMiddleware, roleMiddleware("recruiter"), asyncHandler(job.deleteJob));

export default router;