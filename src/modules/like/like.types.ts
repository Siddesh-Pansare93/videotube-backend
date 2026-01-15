import { Types } from "mongoose";

// ==================== Response DTOs ====================

export interface LikedVideoDto {
  _id: Types.ObjectId;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: {
    _id: Types.ObjectId;
    username: string;
    avatar: string;
  };
}

export interface LikeResponseDto {
  _id: Types.ObjectId;
  likedBy: Types.ObjectId;
  video?: Types.ObjectId;
  comment?: Types.ObjectId;
  tweet?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ToggleLikeResponseDto {
  liked: boolean;
}
