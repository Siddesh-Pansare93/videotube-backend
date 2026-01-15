import { Types } from "mongoose";

// ==================== Request DTOs ====================

export interface CreateTweetDto {
  content: string;
}

export interface UpdateTweetDto {
  content: string;
}

// ==================== Response DTOs ====================

export interface TweetOwnerDto {
  _id: Types.ObjectId;
  username: string;
  avatar: string;
}

export interface TweetResponseDto {
  _id: Types.ObjectId;
  content: string;
  owner: TweetOwnerDto;
  createdAt: Date;
  updatedAt: Date;
}
