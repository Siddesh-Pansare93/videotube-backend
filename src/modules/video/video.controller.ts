import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest, MulterFiles } from "../../types/index.js";
import {
  deleteVideoService,
  getAllVideosService,
  getVideoByIdService,
  publishVideoService,
  togglePublishStatusService,
  updateVideoService,
} from "./video.service.js";
import { ApiError } from "../../utils/ApiError.js";

const getAllVideos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const result = await getAllVideosService(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Successfully fetched all videos"));
});

const publishAVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    
    const files = req.files as MulterFiles | undefined;
    const video = await publishVideoService(req.body, files, req.user._id as any); // Type cast for now

    res
      .status(200)
      .json(
        new ApiResponse(200, video, "Video Published Succesfully")
      );
});

const getVideoById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { videoId } = req.params as { videoId: string };
    const video = await getVideoByIdService(videoId);
    res
    .status(200)
    .json(new ApiResponse(200, video, "Video Found Successfully"));
});

const updateVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { videoId } = req.params as { videoId: string };
    
    // In original controller, logic was findOneAndUpdate with owner check. 
    // My service handles logic.
    const video = await updateVideoService(videoId, req.body, req.file, req.user._id as any);
    
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          video,
          "Video Details Updated Successfully"
        )
      );
});

const deleteVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { videoId } = req.params as { videoId: string };
    
    await deleteVideoService(videoId, req.user._id as any);
    
    res
      .status(200)
      .json(new ApiResponse(200, {}, "video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { videoId } = req.params as { videoId: string };
    
    const video = await togglePublishStatusService(videoId, req.user._id as any);
    
     res
      .status(200)
      .json(
        new ApiResponse(
          200,
          video,
          "Toggled Publish status successfully"
        )
      );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
