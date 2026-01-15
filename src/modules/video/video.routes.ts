import { Router, RequestHandler } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "./video.controller.js";
import {
  getVideoSchema,
  publishVideoSchema,
  updateVideoSchema,
} from "./video.validation.js";

const router = Router();

router.use(verifyJWT as unknown as RequestHandler);

router.route("/").get(getAllVideos as unknown as RequestHandler);

router.route("/create").post(
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validate(publishVideoSchema) as unknown as RequestHandler,
  publishAVideo as unknown as RequestHandler
);

router
  .route("/:videoId")
  .get(
      validate(getVideoSchema) as unknown as RequestHandler,
      getVideoById as unknown as RequestHandler
   )
  .patch(
      upload.single("thumbnail"), 
      validate(updateVideoSchema) as unknown as RequestHandler,
      updateVideo as unknown as RequestHandler
   )
  .delete(
      validate(getVideoSchema) as unknown as RequestHandler,
      deleteVideo as unknown as RequestHandler
   );

router
  .route("/toggle/publish/:videoId")
  .patch(
      validate(getVideoSchema) as unknown as RequestHandler,
      togglePublishStatus as unknown as RequestHandler
   );

export default router;
