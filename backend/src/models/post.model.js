import mongoose, { Schema } from "mongoose";

const counterSchema = new Schema({
  _id: {
    type: String,
  },
  seq: {
    type: Number,
    default: 0,
  },
});

export const Counter = mongoose.model("Counter", counterSchema);
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
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

postSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: "Post" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.postId = counter.seq;
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});
export const Post = mongoose.model("Post", postSchema);
