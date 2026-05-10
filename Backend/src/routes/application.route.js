import express from "express";
import * as application from "../controller/application.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
const router = express.Router();

router.post("/:id", authMiddleware, roleMiddleware("job_seeker"), application.applyToJob);
router.get("/me", authMiddleware, roleMiddleware("job_seeker"), application.myApplications);
router.get("/job/:jobId",authMiddleware, roleMiddleware("recruiter"), application.getApplicationsForJob);
router.put("/:id/status",authMiddleware, roleMiddleware("recruiter"), application.updateApplicationStatus);
export default router;