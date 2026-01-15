import { z } from "zod";

export const createPlaylistSchema = z.object({
  body: z.object({
    name: z.string().min(1).trim(),
    description: z.string().min(1).trim(),
  }),
});

export const updatePlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().min(1),
  }),
  body: z.object({
    name: z.string().min(1).trim(),
    description: z.string().min(1).trim(),
  }),
});

export const getPlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().min(1),
  }),
});

export const getUserPlaylistsSchema = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
});

export const addVideoToPlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().min(1),
    videoId: z.string().min(1),
  }),
});

export const removeVideoFromPlaylistSchema = z.object({
  params: z.object({
    playlistId: z.string().min(1),
    videoId: z.string().min(1),
  }),
});
