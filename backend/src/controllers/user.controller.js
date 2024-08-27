import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = async (request, reply) => {
  try {
    const { fullname, email, password } = request.body;
    if (!(fullname && email && password)) {
      throw new ApiError(400, "Please provide all required fields");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(402, "User Already Exists");
    const user = await User.create({ fullname, email, password });
    const accessToken = await user.generateAcessToken();
    const refreshToken = await user.generateRefreshToken();
    const res = JSON.parse(JSON.stringify(user));
    return reply
      .status(201)
      .send(
        new ApiResponse(
          201,
          { ...res, accessToken, refreshToken },
          "User Registered Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      error.statuscode || 500,
      error.message || "Something Went Wrong",
      error
    );
  }
};

const loginUser = async (request, reply) => {
  try {
    const { email, password } = request.body;
    if (!(email && password))
      throw new ApiError(400, "Please Provide email and password");
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found with this email");
    const isMatched = await user.isPassWordCorrect(password);
    if (!isMatched) throw new ApiError(400, "Incorrect Credentials");
    const accessToken = await user.generateAcessToken();
    const refreshToken = await user.generateRefreshToken();
    const res = JSON.parse(JSON.stringify(user));
    return reply
      .status(200)
      .send(
        new ApiResponse(
          200,
          { ...res, accessToken, refreshToken },
          "User Logged In Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      error.statuscode || 500,
      error.message || "Something Went Wrong",
      error
    );
  }
};
export { registerUser, loginUser };
