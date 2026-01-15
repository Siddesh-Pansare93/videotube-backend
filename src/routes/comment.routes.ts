import { Router, RequestHandler } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT as unknown as RequestHandler);

router
  .route("/:videoId")
  .get(getVideoComments as unknown as RequestHandler)
  .post(addComment as unknown as RequestHandler);
router
  .route("/c/:commentId")
  .delete(deleteComment as unknown as RequestHandler)
  .patch(updateComment as unknown as RequestHandler);

export default router;
