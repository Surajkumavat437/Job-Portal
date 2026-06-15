import express from "express";
import * as application from "../controller/application.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import asyncHandler from "../utils/asyncHandler.js"; // 👈 Import your asyncHandler

const router = express.Router();

// 🔥 WRAP THESE IN ASYNCHANDLER SO ERRORS REPORT BACK TO FRONTEND:
router.post("/:id", authMiddleware, roleMiddleware("job_seeker"), asyncHandler(application.applyToJob));
router.get("/me", authMiddleware, roleMiddleware("job_seeker"), asyncHandler(application.myApplications));
router.get("/job/:jobId", authMiddleware, roleMiddleware("recruiter"), asyncHandler(application.getApplicationsForJob));
router.put("/:id/status", authMiddleware, roleMiddleware("recruiter"), asyncHandler(application.updateApplicationStatus));

export default router;