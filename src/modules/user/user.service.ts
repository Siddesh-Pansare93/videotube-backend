import { User } from "./user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import mongoose from "mongoose";

export const getCurrentUserService = async (user: any) => {
  return user;
};

export const updateAccountDetailsService = async (userId: mongoose.Types.ObjectId, body: any): Promise<any> => {
  const { fullName, email } = body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields required");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullName,
        email,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  if (!user) {
     throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateAvatarService = async (userId: mongoose.Types.ObjectId, filePath: string): Promise<any> => {
  const avatar = await uploadOnCloudinary(filePath);

  if (!avatar?.url) {
    throw new ApiError(400, "Error while uploading Avatar");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

   if (!user) {
     throw new ApiError(404, "User not found");
  }

  return user;
};

export const updateCoverImageService = async (userId: mongoose.Types.ObjectId, filePath: string): Promise<any> => {
  const coverImage = await uploadOnCloudinary(filePath);

  if (!coverImage?.url) {
    throw new ApiError(400, "Error while uploading Cover Image");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password");

     if (!user) {
     throw new ApiError(404, "User not found");
  }

  return user;
};

export const getChannelUserProfileService = async (currentUserId: mongoose.Types.ObjectId, username: string) => {
  const channel = await User.aggregate([
    {
      $match: {
        username: username.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "Subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$Subscribers",
        },
        channelsubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [currentUserId, "$Subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1, // Note: Model has fullName (camelCase), aggregation used fullname (lowercase) in original? Checking user.model.ts -> fullName.
        username: 1,
        subscriberCount: 1,
        channelsubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "Channel does not Exists");
  }

  return channel[0];
};

export const getUserWatchHistoryService = async (userId: mongoose.Types.ObjectId) => {
  const userWatchHistory = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId.toString()),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ]);

  if (!userWatchHistory?.length) {
    throw new ApiError(404, "Failed to fetch User watch History");
  }

  return userWatchHistory[0].watchHistory;
};
