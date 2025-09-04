import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getChannelStats,
    getChannelVideos,
    getChannelAnalytics
} from "../controller/dashboard.controller.js";

const router = Router();

// Protected routes - require authentication
router.use(verifyJWT);

// Get channel statistics
router.get("/stats", getChannelStats);

// Get channel videos
router.get("/videos", getChannelVideos);

// Get channel analytics
router.get("/analytics", getChannelAnalytics);

export default router;