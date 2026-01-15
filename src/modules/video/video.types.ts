import { Types } from "mongoose";

// ==================== Request DTOs ====================

export interface PublishVideoDto {
  title: string;
  description: string;
}

export interface UpdateVideoDto {
  title: string;
  description: string;
}

export interface GetAllVideosQueryDto {
  page?: number;
  limit?: number;
  query?: string;
  sortBy?: "latest" | "oldest" | "views";
}

// ==================== Response DTOs ====================

export interface VideoOwnerDto {
  _id: Types.ObjectId;
  username: string;
  avatar: string;
}

export interface VideoResponseDto {
  _id: Types.ObjectId;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: VideoOwnerDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllVideosResponseDto {
  videos: VideoResponseDto[];
  page: number;
  limit: number;
  totalPages: number;
  totalVideos: number;
}
