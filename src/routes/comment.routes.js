import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComments, updateComment } from "../controllers/comment.controller.js";

const router = Router();

router.use(verifyJWT)

router.post("/:videoId", addComment);
router.route("/:commentId").patch(updateComment).delete(deleteComment);
router.get("/:videoId", getComments);
export default router;