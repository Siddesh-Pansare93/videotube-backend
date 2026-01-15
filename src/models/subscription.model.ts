import mongoose, { Schema } from "mongoose";
import { ISubscription } from "../types/index.js";

const subscriptionSchema = new Schema<ISubscription>(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
