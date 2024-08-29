import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import {
  uploadOnCloudinary,
  deletefromCloudinary,
} from "../utils/cloudinary.js";
const createPost = async (request, reply) => {
  try {
    const { title, content, status } = request.body;
    if (!(title && content && status)) {
      throw new ApiError(400, "All the fields are required");
    }
    const myfile = request.file.buffer;
    // const upload = await uploadOnCloudinary(myfile);
    const post = await Post.create({
      title,
      content,
      status,
      user: request.user._id,
      // featuredImage: upload.url,
      featuredImage:
        "http://res.cloudinary.com/harshbachchani/image/upload/v1724847566/blogProject/klx9ct01tdswbdftaej9.jpg",
    });

    return reply
      .status(200)
      .send(new ApiResponse(200, post, "Post Created Successfully"));
  } catch (error) {
    return reply
      .status(error?.statuscode || 500)
      .send(
        new ApiError(
          error?.statuscode || 500,
          error?.message || "Something Went Wrong",
          error
        )
      );
  }
};
const updatePost = async (request, reply) => {
  try {
    const postId = request.params.postId;
    const { title, content, status } = request.body;
    if (!(title || content || status)) {
      throw new ApiError(
        400,
        "Atleast One field is required for updating Post"
      );
    }
    let updatedInfo = {};
    if (title) updatedInfo.title = title;
    if (content) updatedInfo.content = content;
    if (status) updatedInfo.status = status;
    const post = await Post.findOne({ postId });
    if (!post) throw new ApiError(401, "Post with this post Id not exists");
    const updatedPost = await Post.findByIdAndUpdate(post._id, updatedInfo, {
      new: true,
    });
    return reply.send(
      new ApiResponse(200, updatedPost, "Post Updated Successfully")
    );
  } catch (error) {
    return reply
      .status(error?.statuscode || 500)
      .send(
        new ApiError(
          error?.statuscode || 500,
          error?.message || "Something Went Wrong",
          error
        )
      );
  }
};

const deletePost = async (request, reply) => {
  try {
    const postId = request.params.postId;
    if (!postId) throw new ApiError(400, "PostId is required");
    const post = await Post.findOne({ postId });
    if (!post) throw new ApiError(400, `Post with id: ${postId} Not Found`);
    const url = post.featuredImage;
    const deleted = await deletefromCloudinary(url);
    if (!deleted) throw new ApiError(500, "Server Error while deleting image");
    const deletedPost = await Post.findByIdAndDelete(post._id);
    return reply
      .status(200)
      .send(
        new ApiResponse(
          200,
          deletedPost,
          `Post with id: ${postId} deleted Successfully`
        )
      );
  } catch (error) {
    return reply
      .status(error?.statuscode || 500)
      .send(
        new ApiError(
          error?.statuscode || 500,
          error?.message || "Something Went Wrong",
          error
        )
      );
  }
};

const getAllPosts = async (request, reply) => {
  try {
    const userId = request?.user._id;
    const posts = await Post.find({
      user: userId,
    });
    if (!posts.length) throw new ApiError(400, "Posts of user not found");
    return reply
      .status(200)
      .send(new ApiResponse(200, posts, "Posts Fetched Successfully"));
  } catch (error) {
    return reply
      .status(error?.statuscode || 500)
      .send(
        new ApiError(
          error?.statuscode || 500,
          error?.message || "Something Went Wrong",
          error
        )
      );
  }
};

const getPost = async (request, reply) => {
  try {
    const postId = request.params.postId;
    if (!postId) throw new ApiError(400, "Post Id is required");
    const post = await Post.findOne({ postId });
    if (!post) throw new ApiError(400, `Post with id: ${postId} Not Found`);
    return reply
      .status(200)
      .send(
        new ApiResponse(
          200,
          post,
          `Post with id: ${postId} Fetched Successfully`
        )
      );
  } catch (error) {
    return reply
      .status(error?.statuscode || 500)
      .send(
        new ApiError(
          error?.statuscode || 500,
          error?.message || "Something Went Wrong",
          error
        )
      );
  }
};
export { createPost, updatePost, deletePost, getAllPosts, getPost };
