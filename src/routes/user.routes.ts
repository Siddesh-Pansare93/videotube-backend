import { Router, RequestHandler } from "express";
import {
  changeCurrentPassword,
  getChannelUserProfile,
  getCurrentUser,
  getUserWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser as unknown as RequestHandler
);

router.route("/login").post(loginUser as unknown as RequestHandler);

// secured routes

router
  .route("/logout")
  .get(
    verifyJWT as unknown as RequestHandler,
    logoutUser as unknown as RequestHandler
  );
router
  .route("/refresh-token")
  .post(
    verifyJWT as unknown as RequestHandler,
    refreshAccessToken as unknown as RequestHandler
  );
router
  .route("/update-profile")
  .patch(
    verifyJWT as unknown as RequestHandler,
    updateAccountDetails as unknown as RequestHandler
  );
router
  .route("/change-password")
  .patch(
    verifyJWT as unknown as RequestHandler,
    changeCurrentPassword as unknown as RequestHandler
  );
router
  .route("/current-user")
  .get(
    verifyJWT as unknown as RequestHandler,
    getCurrentUser as unknown as RequestHandler
  );
router
  .route("/update-avatar")
  .post(
    verifyJWT as unknown as RequestHandler,
    upload.single("avatar"),
    updateAvatar as unknown as RequestHandler
  );
router
  .route("/update-coverimage")
  .post(
    verifyJWT as unknown as RequestHandler,
    upload.single("coverImage"),
    updateAvatar as unknown as RequestHandler
  );
router
  .route("/update-accountdetails")
  .patch(
    verifyJWT as unknown as RequestHandler,
    updateAccountDetails as unknown as RequestHandler
  );
router
  .route("/channelprofile/:username")
  .get(
    verifyJWT as unknown as RequestHandler,
    getChannelUserProfile as unknown as RequestHandler
  );
router
  .route("/watchhistory")
  .get(
    verifyJWT as unknown as RequestHandler,
    getUserWatchHistory as unknown as RequestHandler
  );

export default router;
