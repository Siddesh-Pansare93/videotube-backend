import { Router, RequestHandler } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "./comment.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  addCommentSchema,
  deleteCommentSchema,
  getVideoCommentsSchema,
  updateCommentSchema,
} from "./comment.validation.js";

const router = Router();
router.use(verifyJWT as unknown as RequestHandler);

router
  .route("/:videoId")
  .get(
      validate(getVideoCommentsSchema) as unknown as RequestHandler,
      getVideoComments as unknown as RequestHandler
   )
  .post(
      validate(addCommentSchema) as unknown as RequestHandler,
      addComment as unknown as RequestHandler
   );

router
  .route("/c/:commentId")
  .delete(
      validate(deleteCommentSchema) as unknown as RequestHandler,
      deleteComment as unknown as RequestHandler
   )
  .patch(
      validate(updateCommentSchema) as unknown as RequestHandler,
      updateComment as unknown as RequestHandler
   );

export default router;
