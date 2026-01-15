import { z } from "zod";

export const toggleSubscriptionSchema = z.object({
  params: z.object({
    channelId: z.string().min(1),
  }),
});

export const getUserChannelSubscribersSchema = z.object({
  params: z.object({
    channelId: z.string().min(1),
  }),
});

export const getSubscribedChannelsSchema = z.object({
  params: z.object({
    subscriberId: z.string().min(1),
  }),
});
