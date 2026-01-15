import { Types } from "mongoose";

// ==================== Request DTOs ====================

export interface RegisterUserDto {
  fullName: string;
  email: string;
  username: string;
  password: string;
}

export interface LoginUserDto {
  email?: string;
  username?: string;
  password: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

// ==================== Response DTOs ====================

export interface UserResponseDto {
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

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}
