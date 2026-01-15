import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IComment } from "../types/index.js";

const commentSchema = new Schema<IComment>({
  content: {
    type: String,
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
