import { Response } from "express";
import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuthenticatedRequest } from "../types/index.js";

const toggleSubscription = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    console.log(channelId);
    // TODO: toggle subscription

    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Channel not found");
    }

    const userId = req.user?._id;

    const isSubscribed = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (isSubscribed) {
      await Subscription.deleteOne({ subscriber: userId, channel: channelId });
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { subscribed: false },
            "Subscription cancelled successfully"
          )
        );
    } else {
      const subscribtion = await Subscription.create({
        subscriber: userId,
        channel: channelId,
      });

      if (!subscribtion) {
        throw new ApiError(400, "Failed to subscribe");
      }
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { subscribed: true },
            "Subscription toggled successfully"
          )
        );
    }
  } catch (error) {
    const err = error as Error;
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          `Failed to toggle subscription due to ${err.message}`
        )
      );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { channelId } = req.params;
    const channelIdStr = Array.isArray(channelId) ? channelId[0] : channelId;

    const subscribers = await Subscription.aggregate([
      {
        $match: { channel: new mongoose.Types.ObjectId(channelIdStr) },
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

    console.log(subscribers);
    if (!subscribers) {
      res.status(400).json("Not able to find any subscriber");
      return;
    }

    const subscribersList = subscribers.map(
      (item: { subscribersList: unknown }) => item.subscribersList
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribersList,
          "user channel subscribers fetched Successfully"
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
          `Failed to get subscribers due to ${err.message}`
        )
      );
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { subscriberId } = req.params;
    const subscriberIdStr = Array.isArray(subscriberId) ? subscriberId[0] : subscriberId;

    const subscribedChannels = await Subscription.aggregate([
      {
        $match: { subscriber: new mongoose.Types.ObjectId(subscriberIdStr) },
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

    // res.send(subscribedChannels)

    if (!subscribedChannels) {
      throw new ApiError(400, "Failed to find Subscribed Channels");
    }
    const channelList = subscribedChannels.map(
      (item: { channel: unknown }) => item.channel
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelList,
          "SuccessFully fetched user Subscribed Channels"
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
          `Failed to fetch User Subscribed Channels due to ${err.message}`
        )
      );
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
