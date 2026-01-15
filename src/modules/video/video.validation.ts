import { z } from "zod";

export const publishVideoSchema = z.object({
  body: z.object({
    title: z.string().min(1).trim(),
    description: z.string().min(1).trim(),
  }),
});

export const updateVideoSchema = z.object({
    params: z.object({
        videoId: z.string().min(1)
    }),
    body: z.object({
        title: z.string().min(1).trim(),
        description: z.string().min(1).trim(),
    })
})

export const getVideoSchema = z.object({
    params: z.object({
        videoId: z.string().min(1)
    })
})
