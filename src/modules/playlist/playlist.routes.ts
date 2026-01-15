import { Router, RequestHandler } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "./playlist.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  addVideoToPlaylistSchema,
  createPlaylistSchema,
  getPlaylistSchema,
  getUserPlaylistsSchema,
  removeVideoFromPlaylistSchema,
  updatePlaylistSchema,
} from "./playlist.validation.js";

const router = Router();
router.use(verifyJWT as unknown as RequestHandler);

router.route("/").post(
    validate(createPlaylistSchema) as unknown as RequestHandler,
    createPlaylist as unknown as RequestHandler
);

router
  .route("/:playlistId")
  .get(
      validate(getPlaylistSchema) as unknown as RequestHandler,
      getPlaylistById as unknown as RequestHandler
   )
  .patch(
      validate(updatePlaylistSchema) as unknown as RequestHandler,
      updatePlaylist as unknown as RequestHandler
   )
  .delete(
      validate(getPlaylistSchema) as unknown as RequestHandler,
      deletePlaylist as unknown as RequestHandler
   );

router.route("/add/:videoId/:playlistId").patch(
    validate(addVideoToPlaylistSchema) as unknown as RequestHandler,
    addVideoToPlaylist as unknown as RequestHandler
);

router
  .route("/remove/:videoId/:playlistId")
  .patch(
      validate(removeVideoFromPlaylistSchema) as unknown as RequestHandler,
      removeVideoFromPlaylist as unknown as RequestHandler
   );

router.route("/user/:userId").get(
    validate(getUserPlaylistsSchema) as unknown as RequestHandler,
    getUserPlaylists as unknown as RequestHandler
);

export default router;
