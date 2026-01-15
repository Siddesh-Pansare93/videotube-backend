import { Router, RequestHandler } from "express";
import {
  changeCurrentPassword,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "./auth.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  changePasswordSchema,
  loginUserSchema,
  refreshAccessTokenSchema,
  registerUserSchema,
} from "./auth.validation.js";

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
  validate(registerUserSchema) as unknown as RequestHandler,
  registerUser as unknown as RequestHandler
);

router.route("/login").post(
  validate(loginUserSchema) as unknown as RequestHandler,
  loginUser as unknown as RequestHandler
);

// secured routes
router.route("/logout").post(
    verifyJWT as unknown as RequestHandler, 
    logoutUser as unknown as RequestHandler
);

router.route("/refresh-token").post(
    validate(refreshAccessTokenSchema) as unknown as RequestHandler,
    refreshAccessToken as unknown as RequestHandler
);

router.route("/change-password").post(
    verifyJWT as unknown as RequestHandler,
    validate(changePasswordSchema) as unknown as RequestHandler,
    changeCurrentPassword as unknown as RequestHandler
);

export default router;
