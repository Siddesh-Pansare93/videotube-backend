import { Request } from "express";
import { Document, Types } from "mongoose";

// ==================== User Types ====================
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory: Types.ObjectId[];
  password: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// ==================== Video Types ====================
export interface IVideo extends Document {
  _id: Types.ObjectId;
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Comment Types ====================
export interface IComment extends Document {
  _id: Types.ObjectId;
  content: string;
  video: Types.ObjectId;
  owner: Types.ObjectId;
}

// ==================== Like Types ====================
export interface ILike extends Document {
  _id: Types.ObjectId;
  comment?: Types.ObjectId;
  video?: Types.ObjectId;
  tweet?: Types.ObjectId;
  likedBy: Types.ObjectId;
}

// ==================== Playlist Types ====================
export interface IPlaylist extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  Videos: Types.ObjectId[];
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Subscription Types ====================
export interface ISubscription extends Document {
  _id: Types.ObjectId;
  subscriber: Types.ObjectId;
  channel: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Tweet Types ====================
export interface ITweet extends Document {
  _id: Types.ObjectId;
  owner: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Request Types ====================
export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

// ==================== JWT Payload Types ====================
export interface AccessTokenPayload {
  _id: string;
  username: string;
  email: string;
  fullName: string;
}

export interface RefreshTokenPayload {
  _id: string;
}

// ==================== Cloudinary Types ====================
export interface CloudinaryUploadResponse {
  url: string;
  secure_url: string;
  public_id: string;
  duration?: number;
  resource_type: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

// ==================== Multer Types ====================
export interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}
