import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    featuredImage: {
      type: String,
      required: [true, "Featured Image URL is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      index: true,
    },
    postId: {
      type: Number,
      unique: true,
      index: true,
      required: [true, "PostId is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Post = mongoose.model("Post", postSchema);
