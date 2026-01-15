import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "./playlist.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const createPlaylistService = async (body: any, userId: string) => {
    const { name, description } = body;
    
    if (!name || !description) {
      throw new ApiError(400, "Name and description of the playlist is required");
    }

    const createdPlaylist = await Playlist.create({
      name,
      description,
      owner: userId,
    });

    if (!createdPlaylist) {
      throw new ApiError(500, "Playlist creation Failed due to some internal issue");
    }
    
    return createdPlaylist;
};

export const getUserPlaylistsService = async (userId: string) => {
    if (!isValidObjectId(userId)) {
      throw new ApiError(404, "failed to find User");
    }

    const userPlaylists = await Playlist.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "Videos",
          foreignField: "_id",
          as: "playlistVideos",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "ownerDetails",
                pipeline: [
                  {
                    $project: {
                      username: 1,
                      email: 1,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                ownerUsername: { $first: "$ownerDetails.username" },
              },
            },
            {
              $project: {
                _id: 0,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                ownerUsername: 1,
                isPublished: 1,
                duration: 1,
                views: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "playlistOwnerDetails",
          pipeline: [
            {
              $project: {
                _id: 0,
                username: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          playlistOwnerName: { $first: "$playlistOwnerDetails.username" },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          playlistVideos: 1,
          playlistOwnerName: 1,
          description: 1,
        },
      },
    ]);

    if (!userPlaylists?.length) {
      throw new ApiError(404, "User Playlist not Found");
    }

    return userPlaylists;
};

export const getPlaylistByIdService = async (playlistId: string) => {
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Playlist does not exist with this id");
    }

    const playlist = await Playlist.findById(playlistId)
      .populate({
        path: "Videos",
        populate: {
          path: "owner",
          select: "username -_id",
        },
        select: "-_id -__v",
      })
      .populate({
        path: "owner",
        select: "username -_id",
      })
      .select(" -_id -__v");

    if (!playlist) {
      throw new ApiError(404, "Playlist not found");
    }
    
    return playlist;
};

export const addVideoToPlaylistService = async (playlistId: string, videoId: string, userId: string) => {
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Playlist or Video with Following ID not found");
    }

    const playlistAfterAddingVideo = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: userId,
      },
      {
        $addToSet: {
          Videos: videoId,
        },
      },
      {
        new: true,
      }
    );

    if (!playlistAfterAddingVideo) {
      throw new ApiError(400, "Error Occured While adding Video");
    }

    return playlistAfterAddingVideo;
};

export const removeVideoFromPlaylistService = async (playlistId: string, videoId: string, userId: string) => {
    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
      throw new ApiError(400, "Playlist or Video does not exist");
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: userId,
      },
      {
        $pull: {
          Videos: videoId,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedPlaylist) {
      throw new ApiError(400, "Not able to remove Video from Playlist");
    }
    
    return updatedPlaylist;
};

export const deletePlaylistService = async (playlistId: string, userId: string) => {
     if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Playlist does not exist with this id");
    }

    const deletedPlaylist = await Playlist.findOneAndDelete({
      _id: playlistId,
      owner: userId,
    });

    if (!deletedPlaylist) {
      throw new ApiError(400, "Failed to delete playlist");
    }
    
    return deletedPlaylist;
};

export const updatePlaylistService = async (playlistId: string, body: any, userId: string) => {
    const { name, description } = body;
    
    if (!name || !description) {
         throw new ApiError(400, "All Feilds are required");
    }

    const updatedPlaylist = await Playlist.findOneAndUpdate(
      {
        _id: playlistId,
        owner: userId,
      },
      {
        $set: {
          name,
          description,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedPlaylist) {
      throw new ApiError(400, "Error Occurred While updating Playlist details");
    }
    
    return updatedPlaylist;
};
