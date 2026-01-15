import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest } from "../../types/index.js";
import {
  addVideoToPlaylistService,
  createPlaylistService,
  deletePlaylistService,
  getPlaylistByIdService,
  getUserPlaylistsService,
  removeVideoFromPlaylistService,
  updatePlaylistService,
} from "./playlist.service.js";
import { ApiError } from "../../utils/ApiError.js";

const createPlaylist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const createdPlaylist = await createPlaylistService(req.body, req.user._id as any);
    
    res
      .status(200)
      .json(
        new ApiResponse(200, createdPlaylist, "Playlist created Successfully")
      );
});

const getUserPlaylists = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req.params as { userId: string };
    const userPlaylists = await getUserPlaylistsService(userId);
    
     res
      .status(200)
      .json(
        new ApiResponse(200, userPlaylists, "User Playlist successfully found")
      );
});

const getPlaylistById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     const { playlistId } = req.params as { playlistId: string };
     const playlist = await getPlaylistByIdService(playlistId);
     
     res
      .status(200)
      .json(new ApiResponse(200, playlist, "Playlist found Successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     if (!req.user?._id) throw new ApiError(401, "Unauthorized");
     const { playlistId, videoId } = req.params as { playlistId: string; videoId: string };
     
     const playlist = await addVideoToPlaylistService(playlistId, videoId, req.user._id as any);
     
      res
      .status(200)
      .json(
        new ApiResponse(
          200,
          playlist,
          "Video added to playlist successfully"
        )
      );
});

const removeVideoFromPlaylist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     if (!req.user?._id) throw new ApiError(401, "Unauthorized");
     const { playlistId, videoId } = req.params as { playlistId: string; videoId: string };
     
     const updatedPlaylist = await removeVideoFromPlaylistService(playlistId, videoId, req.user._id as any);
     
      res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Video removed successfully from playlist"
        )
      );
});

const deletePlaylist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     if (!req.user?._id) throw new ApiError(401, "Unauthorized");
     const { playlistId } = req.params as { playlistId: string };
     
     const deletedPlaylist = await deletePlaylistService(playlistId, req.user._id as any);
     
    res
      .status(200)
      .json(
        new ApiResponse(200, deletedPlaylist, "SuccessFully deleted Playlist")
      );
});

const updatePlaylist = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
     if (!req.user?._id) throw new ApiError(401, "Unauthorized");
     const { playlistId } = req.params as { playlistId: string };
     
     const updatedPlaylist = await updatePlaylistService(playlistId, req.body, req.user._id as any);
     
     res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedPlaylist,
          "Successfully updated Playlist details"
        )
      );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
