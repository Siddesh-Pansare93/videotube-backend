import { Router } from "express";
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
    updateAvatar
} from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)


// secured routes

router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, refreshAccessToken)
router.route("/update-profile").patch(verifyJWT, updateAccountDetails)
router.route("/change-password").patch(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/update-coverimage").post(verifyJWT, upload.single("coverImage"), updateAvatar)
router.route("/update-accountdetails").patch(verifyJWT, updateAccountDetails)
router.route("/channelprofile/:username").get(verifyJWT, getChannelUserProfile)
router.route("/watchhistory").get(verifyJWT, getUserWatchHistory)


export default router;
