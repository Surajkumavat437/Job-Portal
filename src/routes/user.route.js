import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as userController from "../controller/user.controller.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/me", authMiddleware, asyncHandler(userController.getCurrentUser));
router.get("/profile", authMiddleware, asyncHandler(userController.getProfile));
router.put("/profile", authMiddleware, asyncHandler(userController.updateProfile));

export default router;