import { Types } from "mongoose";

// ==================== Response DTOs ====================

export interface SubscriberDto {
  _id: Types.ObjectId;
  username: string;
  fullName: string;
  avatar: string;
}

export interface SubscribedChannelDto {
  _id: Types.ObjectId;
  username: string;
  fullName: string;
  avatar: string;
}

export interface ToggleSubscriptionResponseDto {
  subscribed: boolean;
}
