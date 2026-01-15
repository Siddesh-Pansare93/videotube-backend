import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../video/video.model.js";
import { Subscription } from "../subscription/subscription.model.js";
import { Like } from "../like/like.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const getChannelStatsService = async (channelId: string) => {
    // TOTAL SUBSCRIBERS
    const subscriberCount = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $count: "subscribers",
      },
    ]);
    const totalSubscribers = subscriberCount?.length
      ? subscriberCount[0].subscribers
      : 0;

    // TOTAL VIDEOS
    const videosCount = await Video.find({ owner: channelId });
    const totalVideos = videosCount?.length ? videosCount.length : 0;

    // TOTAL LIKES
    const likesCount = await Like.aggregate([
      {
        $match: {
          video: {
            $in: await Video.find({
              owner: new mongoose.Types.ObjectId(channelId),
            }).distinct("_id"),
          },
        },
      },
      {
        $count: "likes",
      },
    ]);
    const totalLikes = likesCount?.length ? likesCount[0].likes : 0;

    // TOTAL VIEWS
    const viewsCount = await Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(channelId), // Fixed: needs to be ObjectId usually in aggregation match
        },
      },
      {
        $group: {
          _id: null,
          views: { $sum: "$views" },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);
    const totalViews = viewsCount?.length ? viewsCount[0].views : 0;

    const channelStats = {
      totalLikes,
      totalSubscribers,
      totalVideos,
      totalViews,
    };
    
    return channelStats;
};

export const getChannelVideosService = async (channelId: string) => {
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel does not exist");
    }

    const channelVideos = await Video.find({
      owner: channelId,
    }).populate({ path: "owner", select: "username" });

    if (!channelVideos?.length) {
      throw new ApiError(404, "No Videos Found for this channel");
    }
    
    return channelVideos;
};
