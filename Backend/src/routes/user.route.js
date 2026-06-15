import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import * as userController from "../controller/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";
import roleMiddleware from "../middleware/role.middleware.js"; // 🌟 ADDED IMPORT

const router = express.Router();

// 1. Core Profile Routes
router.get("/me", authMiddleware, asyncHandler(userController.getCurrentUser));
router.get("/profile", authMiddleware, asyncHandler(userController.getProfile));
router.put("/profile", authMiddleware, asyncHandler(userController.updateProfile));

// 🚀 2. NEW SAVED JOBS ENDPOINTS (Restricted to job seekers)
router.post(
  "/saved-jobs/:id", 
  authMiddleware, 
  roleMiddleware("job_seeker"), 
  asyncHandler(userController.toggleSaveJob)
);

router.get(
  "/saved-jobs", 
  authMiddleware, 
  roleMiddleware("job_seeker"), 
  asyncHandler(userController.getSavedJobs)
);

export default router;