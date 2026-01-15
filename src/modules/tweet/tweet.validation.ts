import { z } from "zod";

export const createTweetSchema = z.object({
  body: z.object({
    content: z.string().min(1).trim(),
  }),
});

export const updateTweetSchema = z.object({
  params: z.object({
    tweetId: z.string().min(1),
  }),
  body: z.object({
    content: z.string().min(1).trim(),
  }),
});

export const deleteTweetSchema = z.object({
  params: z.object({
    tweetId: z.string().min(1),
  }),
});
