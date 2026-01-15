import { Types } from "mongoose";

// ==================== Request DTOs ====================

export interface CreatePlaylistDto {
  name: string;
  description: string;
}

export interface UpdatePlaylistDto {
  name: string;
  description: string;
}

// ==================== Response DTOs ====================

export interface PlaylistVideoOwnerDto {
  username: string;
}

export interface PlaylistVideoDto {
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  owner: PlaylistVideoOwnerDto;
}

export interface PlaylistResponseDto {
  _id: Types.ObjectId;
  name: string;
  description: string;
  Videos: PlaylistVideoDto[];
  owner: {
    _id: Types.ObjectId;
    username: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPlaylistDto {
  name: string;
  description: string;
  playlistVideos: PlaylistVideoDto[];
  playlistOwnerName: string;
}
