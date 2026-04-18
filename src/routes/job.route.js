import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/asyncHandler.js";
import * as job from "../controller/job.controller.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();
router.get("/", asyncHandler(job.getJobs));
router.get("/:id", asyncHandler(job.getJobDetail));
router.post("/", authMiddleware,roleMiddleware("recruiter"),asyncHandler(job.createJob));
router.put("/:id", authMiddleware, roleMiddleware("recruiter"),asyncHandler(job.updateJob));
router.delete("/:id", authMiddleware, roleMiddleware("recruiter"),asyncHandler(job.deleteJob));
export default router;