import { Router, RequestHandler } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT as unknown as RequestHandler);

router.route("/toggle/video/:videoId").get(toggleVideoLike as unknown as RequestHandler);
router.route("/toggle/comment/:commentId").get(toggleCommentLike as unknown as RequestHandler);
router.route("/toggle/tweet/:tweetId").get(toggleTweetLike as unknown as RequestHandler);
router.route("/videos").get(getLikedVideos as unknown as RequestHandler);

export default router;
