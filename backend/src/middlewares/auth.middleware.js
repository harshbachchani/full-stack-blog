import fp from "fastify-plugin";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";

const verifyJWT = fp(async (fastify, opts) => {
  fastify.decorate("verifyJWT", async function (request, reply) {
    try {
      const token = request.headers["authorization"]?.replace("Bearer ", "");

      if (!token) throw new ApiError(401, "Unauthorized request");
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (!decodedToken) throw new ApiError(401, "Invalid Access Token");
      const user = await User.findById(decodedToken?._id);
      if (!user) throw new ApiError(401, "Invalid Access Token");
      request.user = user;
    } catch (error) {
      reply
        .status(401)
        .send(
          new ApiError(401, error?.message || "Invalid Access Token", error)
        );
    }
  });
});

export default verifyJWT;
