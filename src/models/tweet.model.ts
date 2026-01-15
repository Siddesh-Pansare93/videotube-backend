import mongoose, { Schema } from "mongoose";
import { ITweet } from "../types/index.js";

const tweetSchema = new Schema<ITweet>(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Tweet = mongoose.model<ITweet>("Tweet", tweetSchema);
