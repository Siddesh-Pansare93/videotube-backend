import { Router, RequestHandler } from "express";
import {
  getChannelUserProfile,
  getCurrentUser,
  getUserWatchHistory,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "./user.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { updateAccountDetailsSchema } from "./user.validation.js";

const router = Router();

router.use(verifyJWT as unknown as RequestHandler); // Apply verifyJWT to all routes

router.route("/current-user").get(getCurrentUser as unknown as RequestHandler);

router
  .route("/update-profile")
  .patch(
      validate(updateAccountDetailsSchema) as unknown as RequestHandler,
      updateAccountDetails as unknown as RequestHandler
  );

router
  .route("/update-avatar")
  .post(
    upload.single("avatar"),
    updateAvatar as unknown as RequestHandler
  );

router
  .route("/update-coverimage")
  .post(
    upload.single("coverImage"),
    updateCoverImage as unknown as RequestHandler
  );

router
  .route("/channelprofile/:username")
  .get(getChannelUserProfile as unknown as RequestHandler);

router
  .route("/watchhistory")
  .get(getUserWatchHistory as unknown as RequestHandler);

export default router;
