import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { AuthenticatedRequest } from "../../types/index.js";
import {
  getSubscribedChannelsService,
  getUserChannelSubscribersService,
  toggleSubscriptionService,
} from "./subscription.service.js";
import { ApiError } from "../../utils/ApiError.js";

const toggleSubscription = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user?._id) throw new ApiError(401, "Unauthorized");
  const { channelId } = req.params as { channelId: string };

  const result = await toggleSubscriptionService(channelId, req.user._id as any);
  
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.subscribed ? "Subscription toggled successfully" : "Subscription cancelled successfully"
      )
    );
});

const getUserChannelSubscribers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { channelId } = req.params as { channelId: string };
  const subscribersList = await getUserChannelSubscribersService(channelId);
  
  res
      .status(200)
      .json(
        new ApiResponse(
          200,
          subscribersList,
          "user channel subscribers fetched Successfully"
        )
      );
});

const getSubscribedChannels = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { subscriberId } = req.params as { subscriberId: string };
  const channelList = await getSubscribedChannelsService(subscriberId);
  
  res
      .status(200)
      .json(
        new ApiResponse(
          200,
          channelList,
          "SuccessFully fetched user Subscribed Channels"
        )
      );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
