import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router() ; 

router.route("/register").post(
    upload.fields([
        {
            name  : "avatar", 
            maxCount :1
        }, 
        {
            name : "coverImage" , 
            maxCount :1
        }
    ]) ,
    registerUser
    )

router.route("/login").post(loginUser)


// secured routes

router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refresh-token").post(verifyJWT ,  refreshAccessToken)
router.route("/update-profile").patch(verifyJWT , updateAccountDetails)
router.route("/change-password").patch(verifyJWT , changeCurrentPassword)
router.route("/current-user").get(verifyJWT , getCurrentUser)


export default router  ;
