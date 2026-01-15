import { Router, RequestHandler } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT as unknown as RequestHandler); // Apply verifyJWT middleware to all routes in this file

router
  .route("/c/:channelId")
  .get(getUserChannelSubscribers as unknown as RequestHandler)
  .post(toggleSubscription as unknown as RequestHandler);

router.route("/u/:subscriberId").get(getSubscribedChannels as unknown as RequestHandler);

export default router;
