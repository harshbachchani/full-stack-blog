import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (request, reply) => {
  const { fullname, email, password } = request.body;
  if (!(fullname && email && password)) {
    throw new ApiError(400, "Please provide all required fields");
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(402, "User Already Exists");
  const user = await User.create({ fullname, email, password });
  const accessToken = await user.generateAcessToken();
  const refreshToken = await user.generateRefreshToken();
  return reply.send(
    new ApiResponse(
      201,
      { ...user, accessToken, refreshToken },
      "User Created Successfully"
    )
  );
});

export { registerUser };
