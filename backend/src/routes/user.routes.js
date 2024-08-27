import { loginUser, registerUser } from "../controllers/user.controller.js";

export default async function (fastify, options) {
  fastify.post("/register", registerUser);
  fastify.post("/login", loginUser);
}
