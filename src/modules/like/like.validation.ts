import { z } from "zod";

export const toggleVideoLikeSchema = z.object({
  params: z.object({
    videoId: z.string().min(1),
  }),
});

export const toggleCommentLikeSchema = z.object({
  params: z.object({
    commentId: z.string().min(1),
  }),
});

export const toggleTweetLikeSchema = z.object({
  params: z.object({
    tweetId: z.string().min(1),
  }),
});
