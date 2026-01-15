import { Types } from "mongoose";

// ==================== Request DTOs ====================

export interface AddCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export interface GetVideoCommentsQueryDto {
  page?: number;
  limit?: number;
}

// ==================== Response DTOs ====================

export interface CommentOwnerDto {
  _id: Types.ObjectId;
  username: string;
  avatar: string;
}

export interface CommentResponseDto {
  _id: Types.ObjectId;
  content: string;
  video: Types.ObjectId;
  owner: CommentOwnerDto;
  createdAt: Date;
  updatedAt: Date;
}
