import mongoose, { Schema } from "mongoose";
import { IPlaylist } from "../../types/index.js";

const playlistSchema = new Schema<IPlaylist>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      default: "This is my playlist",
    },
    Videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Playlist = mongoose.model<IPlaylist>("Playlist", playlistSchema);
