import { z } from "zod";

export const getVideoCommentsSchema = z.object({
  params: z.object({
    videoId: z.string().min(1),
  }),
});

export const addCommentSchema = z.object({
  params: z.object({
    videoId: z.string().min(1),
  }),
  body: z.object({
    content: z.string().min(1).trim(),
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    commentId: z.string().min(1),
  }),
  body: z.object({
    content: z.string().min(1).trim(),
  }),
});

export const deleteCommentSchema = z.object({
  params: z.object({
    commentId: z.string().min(1),
  }),
});
