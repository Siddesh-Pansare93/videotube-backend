import { Video } from "./video.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../utils/cloudinary.js";
import { MulterFiles } from "../../types/index.js";
import mongoose, { isValidObjectId } from "mongoose";

export const getAllVideosService = async (queryDetails: any) => {
    const { page = 1, limit = 10, query, sortBy } = queryDetails;
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

    const total = await Video.countDocuments(
      query ? filter : { isPublished: true }
    );

    return {
      videos,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      totalVideos: total,
    };
};

export const publishVideoService = async (body: any, files: MulterFiles | undefined, userId: string) => {
    const { title, description } = body;
    const videoLocalPath = files?.video?.[0]?.path;

    if (!videoLocalPath) {
      throw new ApiError(400, "Video is required");
    }

    let thumbnailLocalPath: string | undefined;
    if (files && Array.isArray(files.thumbnail) && files.thumbnail.length > 0) {
      thumbnailLocalPath = files.thumbnail[0].path;
    }

    const videoDetails = await uploadOnCloudinary(videoLocalPath);
    const thumbnailDetails = await uploadOnCloudinary(thumbnailLocalPath);

    if (!videoDetails || !thumbnailDetails) {
      throw new ApiError(500, "Failed to upload video or thumbnail");
    }

    const video = await Video.create({
      videoFile: videoDetails.url,
      title,
      description,
      duration: videoDetails.duration || 0,
      thumbnail: thumbnailDetails.url,
      isPublished: true,
      owner: userId,
    });

    return video;
};

export const getVideoByIdService = async (videoId: string) => {
    if (!isValidObjectId(videoId)) {
       throw new ApiError(404, "Failed to find Video");
    }
    const video = await Video.findById(videoId).populate("owner", "username avatar");
    if (!video) {
        throw new ApiError(404, "Video Not Found");
    }
    return video;
}

export const updateVideoService = async (videoId: string, body: any, file: Express.Multer.File | undefined, userId: string) => {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "Failed Update : Can't find video with that id");
    }

    const { title, description } = body;
    const thumbnailLocalPath = file?.path;
    
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail is required");
    }

    const oldVideo = await Video.findById(videoId);

    if (!oldVideo) {
      throw new ApiError(404, "Video not found");
    }
    
    if (oldVideo.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }

    await deleteFromCloudinary(oldVideo.thumbnail);
    const updatedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!updatedThumbnail) {
       throw new ApiError(500, "Server Issue : Failed to Update thumbail");
    }

    const updatedDetails = await Video.findOneAndUpdate(
      {
        _id: videoId,
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
    
    return updatedDetails;
}

export const deleteVideoService = async (videoId: string, userId: string) => {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "Video Does not Find");
    }

    const video = await Video.findById(videoId);
    
    if (!video) {
         throw new ApiError(404, "Video not found");
    }
    
    if (video.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }

    await Video.findByIdAndDelete(videoId);
    
    // Optional: Delete from cloudinary as well? Original code didn't seem to have it explicit, 
    // but good practice. For now sticking to original logic logic: findOneAndDelete with owner check.
    // user.controller.ts logic: Video.findOneAndDelete({ _id: videoId, owner });
}

export const togglePublishStatusService = async (videoId: string, userId: string) => {
    if (!isValidObjectId(videoId)) {
      throw new ApiError(404, "Failed to Find Video");
    }

    const video = await Video.findOne({
      _id: videoId,
      owner: userId,
    });

    if (!video) {
      throw new ApiError(404, "Video Not Found");
    }

    video.isPublished = !video.isPublished;
    return await video.save();
}
