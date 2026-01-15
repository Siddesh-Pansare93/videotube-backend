import { Router, RequestHandler } from "express";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "./tweet.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createTweetSchema,
  deleteTweetSchema,
  updateTweetSchema,
} from "./tweet.validation.js";

const router = Router();
router.use(verifyJWT as unknown as RequestHandler);

router.route("/").post(
    validate(createTweetSchema) as unknown as RequestHandler,
    createTweet as unknown as RequestHandler
);

router.route("/user").get(getUserTweets as unknown as RequestHandler);

router
  .route("/:tweetId")
  .patch(
      validate(updateTweetSchema) as unknown as RequestHandler,
      updateTweet as unknown as RequestHandler
   )
  .delete(
      validate(deleteTweetSchema) as unknown as RequestHandler,
      deleteTweet as unknown as RequestHandler
   );

export default router;
