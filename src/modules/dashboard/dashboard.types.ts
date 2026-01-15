import { Types } from "mongoose";

// ==================== Response DTOs ====================

export interface ChannelStatsDto {
  totalViews: number;
  totalSubscribers: number;
  totalVideos: number;
  totalLikes: number;
}

export interface ChannelVideoDto {
  _id: Types.ObjectId;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
