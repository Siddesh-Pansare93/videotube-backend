import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "./subscription.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const toggleSubscriptionService = async (channelId: string, userId: string) => {
    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Channel not found");
    }

    const isSubscribed = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (isSubscribed) {
      await Subscription.deleteOne({ subscriber: userId, channel: channelId });
      return { subscribed: false };
    } else {
      const subscribtion = await Subscription.create({
        subscriber: userId,
        channel: channelId,
      });

      if (!subscribtion) {
        throw new ApiError(400, "Failed to subscribe");
      }
      return { subscribed: true };
    }
};

export const getUserChannelSubscribersService = async (channelId: string) => {
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid Channel ID");
    }

    const subscribers = await Subscription.aggregate([
      {
        $match: { channel: new mongoose.Types.ObjectId(channelId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribers",
          pipeline: [
            {
              $project: {
                username: 1,
                avatar: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          subscribersList: {
            $first: "$subscribers",
          },
        },
      },
      {
        $project: {
          subscribersList: 1,
          _id: 0,
        },
      },
    ]);

    if (!subscribers) {
      throw new ApiError(404, "Not able to find any subscriber");
    }

    const subscribersList = subscribers.map(
      (item: { subscribersList: unknown }) => item.subscribersList
    );

    return subscribersList;
};

export const getSubscribedChannelsService = async (subscriberId: string) => {
    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid Subscriber ID");
    }
    
    const subscribedChannels = await Subscription.aggregate([
      {
        $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "subscribedChannels",
          pipeline: [
            {
              $project: {
                username: 1,
                // email : 1 ,
                avatar: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          channel: { $first: "$subscribedChannels" },
        },
      },
      {
        $project: {
          channel: 1,
          _id: 0,
        },
      },
    ]);

    if (!subscribedChannels) {
      throw new ApiError(404, "Failed to find Subscribed Channels");
    }
    const channelList = subscribedChannels.map(
      (item: { channel: unknown }) => item.channel
    );
    
    return channelList;
};
