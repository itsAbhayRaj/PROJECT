import { Router } from "express";
import { getAllVideos, publishAVideo } from "../controllers/video.controller.js";
import { upload, handleMulterError } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/').get(getAllVideos)

// protected routes
router.route("/").post(
    verifyJWT,
    upload.fields([
        {name: "videoFile", maxCount: 1},
        {name: "thumbnail", maxCount: 1}
    ]),
    handleMulterError,
    publishAVideo
)

export default router;