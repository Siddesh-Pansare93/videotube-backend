import { Router, RequestHandler } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  getAllVideos,
  deleteVideo,
} from "../controllers/video.controller.js";

const router = Router();

router.use(verifyJWT as unknown as RequestHandler);

router.route("/").get(getAllVideos as unknown as RequestHandler);

router.route("/create").post(
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo as unknown as RequestHandler
);

router
  .route("/:videoId")
  .get(getVideoById as unknown as RequestHandler)
  .patch(upload.single("thumbnail"), updateVideo as unknown as RequestHandler)
  .delete(deleteVideo as unknown as RequestHandler);

router
  .route("/toggle/publish/:videoId")
  .patch(togglePublishStatus as unknown as RequestHandler);

export default router;
