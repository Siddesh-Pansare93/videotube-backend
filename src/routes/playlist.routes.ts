import { Router, RequestHandler } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT as unknown as RequestHandler); // Apply verifyJWT middleware to all routes in this file

router.route("/").post(createPlaylist as unknown as RequestHandler);

router
  .route("/:playlistId")
  .get(getPlaylistById as unknown as RequestHandler)
  .patch(updatePlaylist as unknown as RequestHandler)
  .delete(deletePlaylist as unknown as RequestHandler);

router.route("/add/:videoId/:playlistId").patch(addVideoToPlaylist as unknown as RequestHandler);
router
  .route("/remove/:videoId/:playlistId")
  .patch(removeVideoFromPlaylist as unknown as RequestHandler);

router.route("/user/:userId").get(getUserPlaylists as unknown as RequestHandler);

export default router;
