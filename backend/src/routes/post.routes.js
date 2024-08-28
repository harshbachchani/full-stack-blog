import {
  createPost,
  deletePost,
  getAllPosts,
  getPost,
  updatePost,
} from "../controllers/post.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../utils/multer.js";
export default async function (fastify, options) {
  fastify.post(
    "/create",
    { preHandler: [fastify.verifyJWT, upload.single("post")] },
    createPost
  );
  fastify.put("/:postId", { preHandler: fastify.verifyJWT }, updatePost);
  fastify.delete("/:postId", { preHandler: fastify.verifyJWT }, deletePost);
  fastify.get("/:postId", { preHandler: fastify.verifyJWT }, getPost);
  fastify.get("/all", { preHandler: fastify.verifyJWT }, getAllPosts);
}
