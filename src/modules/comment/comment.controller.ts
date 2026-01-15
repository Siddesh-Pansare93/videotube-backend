import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest } from "../../types/index.js";
import {
  addCommentService,
  deleteCommentService,
  getVideoCommentsService,
  updateCommentService,
} from "./comment.service.js";
import { ApiError } from "../../utils/ApiError.js";

const getVideoComments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const { videoId } = req.params as { videoId: string };
    const comments = await getVideoCommentsService(videoId, req.query);
    
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          comments,
          "Successfully fetched Comment for this Video"
        )
      );
});

const addComment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { videoId } = req.params as { videoId: string };
    
    const comment = await addCommentService(videoId, req.body.content, req.user._id as any);
    
    res
      .status(201)
      .json(new ApiResponse(201, comment, "Successfully added Comment"));
});

const updateComment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { commentId } = req.params as { commentId: string };
    
    const updatedComment = await updateCommentService(commentId, req.body.content, req.user._id as any);
    
     res
      .status(200)
      .json(
        new ApiResponse(200, updatedComment, "Successfully updated comment")
      );
});

const deleteComment = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?._id) throw new ApiError(401, "Unauthorized");
    const { commentId } = req.params as { commentId: string };
    
    const deletedComment = await deleteCommentService(commentId, req.user._id as any);
    
    res
      .status(200)
      .json(
        new ApiResponse(200, deletedComment, "Successfully deleted comment")
      );
});

export { getVideoComments, addComment, updateComment, deleteComment };
