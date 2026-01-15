import { Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { AuthenticatedRequest, MulterFiles } from "../types/index.js";

const getAllVideos = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  //TODO: get all videos based on query, sort, pagination
  try {
    const { page = 1, limit = 10, query, sortBy } = req.query;
    const filter: Record<string, unknown> = { isPublished: true };

    if (query) {
      filter.$or = [
        { title: { $regex: query, options: "i" } },
        { description: { $regex: query, options: "i" } },
      ];
    }

    const sort: Record<string, 1 | -1> =
      {
        latest: { createdAt: -1 as const },
        oldest: { createdAt: 1 as const },
        views: { views: -1 as const },
      }[(sortBy as string) || "latest"] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const videos = await Video.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("owner", "username  avatar ");

    if (!videos?.length) {
      throw new ApiError(404, "No videos found");
    }

    const total = await Video.countDocuments(
      query ? filter : { isPublished: true }
    );

    const response = {
      videos,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      totalVideos: total,
    };

    res
      .status(200)
      .json(new ApiResponse(200, response, "Successfully fetched all videos"));
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, `Failed to get videos due to ${err.message}`)
      );
  }
});

const publishAVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: get video, upload to cloudinary, create video
    const { title, description } = req.body;
    // console.log(req.body)
    console.log(req.files);

    if (!title || !description) {
      throw new ApiError(400, "title and description of video is required");
    }

    const files = req.files as MulterFiles | undefined;
    const videoLocalPath = files?.video?.[0]?.path;

    if (!videoLocalPath) {
      throw new ApiError(400, "Video is required");
    }

    let thumbnailLocalPath: string | undefined;
    if (
      files &&
      Array.isArray(files?.thumbnail) &&
      files?.thumbnail.length > 0
    ) {
      thumbnailLocalPath = files?.thumbnail[0].path;
    }

    //uploading files in clondianry

    const videoDetails = await uploadOnCloudinary(videoLocalPath);
    const thumbnailDetails = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoDetails || !thumbnailDetails) {
      throw new ApiError(500, "Failed to upload video or thumbnail");
    }

    // taking only needed info from cloudinary response
    const videoUrl = videoDetails.url;
    const videoDuration = videoDetails.duration || 0;
    const thumbnailUrl = thumbnailDetails.url;

    // Creating Video document in DB
    const PublishedVideo = await Video.create({
      videoFile: videoUrl,
      title,
      description,
      duration: videoDuration,
      thumbnail: thumbnailUrl,
      isPublished: true,
      owner: req.user?._id,
    });

    if (!PublishedVideo) {
      throw new ApiError(400, "Failed to Upload video");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, PublishedVideo, "Video Published Succesfully")
      );
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to publish a video due to ${err.message} ! Please try again`
        )
      );
  }
});

const getVideoById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { videoId } = req.params;
  //TODO: get video by id

  console.log(videoId);

  if (!isValidObjectId(videoId)) {
    throw new ApiError(404, "Failed to find Video");
  }

  const foundVideo = await Video.findById(videoId);

  if (!foundVideo) {
    throw new ApiError(404, "Video Not Found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, foundVideo, "Video Found Successfully"));
});

const updateVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const owner = req.user?._id;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "Failed Update : Can't find video with that id");
    }

    const { title, description } = req.body;

    if ([title, description].some((feild) => !feild || feild?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
    }

    const oldVideo = await Video.findById(videoId);

    if (!oldVideo) {
      throw new ApiError(404, "Video not found");
    }

    const deleteOldThumbnail = await deleteFromCloudinary(oldVideo.thumbnail);

    if (!deleteOldThumbnail) {
      throw new ApiError(500, "Server Issue : Unable to update Thumbanil");
    }

    const updatedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    console.log(updatedThumbnail?.url);
    if (!updatedThumbnail) {
      throw new ApiError(500, "Server Issue : Failed to Update thumbail");
    }

    const updatedDetails = await Video.findOneAndUpdate(
      {
        _id: videoId,
        owner,
      },
      {
        $set: {
          thumbnail: updatedThumbnail.url,
          title,
          description,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedDetails) {
      throw new ApiError(400, "Failed to Update Video Details in Database");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedDetails,
          "Video Details Updated Successfully"
        )
      );
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to Update Video Details due to ${err.message} : Please Try again after sometime`
        )
      );
  }
});

const deleteVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const owner = req.user?._id;
    //TODO: delete video

    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "Video Does not Find");
    }

    const deletedVideo = await Video.findOneAndDelete({
      _id: videoId,
      owner,
    });

    if (!deletedVideo) {
      throw new ApiError(400, "Failed to delete Event");
    }

    res
      .status(200)
      .json(new ApiResponse(200, deletedVideo, "video deleted successfully"));
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to delete Video due to ${err.message}`
        )
      );
  }
});

const togglePublishStatus = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const owner = req.user?._id;

    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "Failed to Find Video");
    }

    const video = await Video.findOne({
      _id: videoId,
      owner,
    });

    if (!video) {
      throw new ApiError(400, "Video Not Found");
    }

    video.isPublished = !video.isPublished;

    const updatedVideo = await video.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedVideo,
          "Toggled Publish status successfully"
        )
      );
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to toggle Publish Status due to ${err.message}`
        )
      );
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
