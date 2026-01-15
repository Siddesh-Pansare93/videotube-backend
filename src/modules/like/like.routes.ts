import { Router, RequestHandler } from "express";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "./like.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  toggleCommentLikeSchema,
  toggleTweetLikeSchema,
  toggleVideoLikeSchema,
} from "./like.validation.js";

const router = Router();
router.use(verifyJWT as unknown as RequestHandler);

router.route("/toggle/video/:videoId").get(
    validate(toggleVideoLikeSchema) as unknown as RequestHandler,
    toggleVideoLike as unknown as RequestHandler
);
router.route("/toggle/comment/:commentId").get(
    validate(toggleCommentLikeSchema) as unknown as RequestHandler,
    toggleCommentLike as unknown as RequestHandler
);
router.route("/toggle/tweet/:tweetId").get(
    validate(toggleTweetLikeSchema) as unknown as RequestHandler,
    toggleTweetLike as unknown as RequestHandler
);
router.route("/videos").get(getLikedVideos as unknown as RequestHandler);

export default router;
