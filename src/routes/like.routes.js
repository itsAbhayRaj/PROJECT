import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos,
} from "../controllers/like.controller.js";

const router = Router();

router.use(verifyJWT);

router.post("/video/:videoId", toggleVideoLike);
router.post("/comment/:commentId", toggleCommentLike);
router.post("/tweet/:tweetId", toggleTweetLike);

router.get("/videos", getLikedVideos);

export default router;
