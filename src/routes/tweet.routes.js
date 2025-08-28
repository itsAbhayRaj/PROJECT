import { Router } from "express";
import { createTweet, deleteTweet, getUserTweets, updateTweet } from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.use(verifyJWT)

router.get("/getTweets/:userId",getUserTweets)
router.post("/createTweet",createTweet)
router.route("/:tweetId")
        .patch(updateTweet)
        .delete(deleteTweet)

export default router;