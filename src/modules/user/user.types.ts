import { Types } from "mongoose";

// ==================== Request DTOs ====================

export interface UpdateAccountDetailsDto {
  fullName: string;
  email: string;
}

// ==================== Response DTOs ====================

export interface UserProfileDto {
  _id: Types.ObjectId;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChannelProfileDto {
  _id: Types.ObjectId;
  username: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  subscriberCount: number;
  channelsubscribedToCount: number;
  isSubscribed: boolean;
}

export interface WatchHistoryVideoDto {
  _id: Types.ObjectId;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  owner: {
    _id: Types.ObjectId;
    username: string;
    fullName: string;
    avatar: string;
  };
}
