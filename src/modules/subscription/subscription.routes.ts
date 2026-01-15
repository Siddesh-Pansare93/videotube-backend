import { Router, RequestHandler } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "./subscription.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  getSubscribedChannelsSchema,
  getUserChannelSubscribersSchema,
  toggleSubscriptionSchema,
} from "./subscription.validation.js";

const router = Router();
router.use(verifyJWT as unknown as RequestHandler);

router
  .route("/c/:channelId")
  .get(
      validate(getUserChannelSubscribersSchema) as unknown as RequestHandler,
      getUserChannelSubscribers as unknown as RequestHandler
   )
  .post(
      validate(toggleSubscriptionSchema) as unknown as RequestHandler,
      toggleSubscription as unknown as RequestHandler
   );

router.route("/u/:subscriberId").get(
    validate(getSubscribedChannelsSchema) as unknown as RequestHandler,
    getSubscribedChannels as unknown as RequestHandler
);

export default router;
