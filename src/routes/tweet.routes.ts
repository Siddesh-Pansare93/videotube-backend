import { Router, RequestHandler } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT as unknown as RequestHandler);

router.route("/").post(createTweet as unknown as RequestHandler);
router.route("/user").get(getUserTweets as unknown as RequestHandler);
router
  .route("/:tweetId")
  .patch(updateTweet as unknown as RequestHandler)
  .delete(deleteTweet as unknown as RequestHandler);

export default router;
