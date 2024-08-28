import { errHandler } from "./middlewares/err.middleware.js";
import Fastify from "fastify";
import FastifyFormbody from "@fastify/formbody";
import cors from "@fastify/cors";
import verifyJWT from "./middlewares/auth.middleware.js";
const app = Fastify();
import multer from "fastify-multer";

app.register(cors, {
  origin: process.env.CORS_ORIGIN,
});

app.register(multer.contentParser);

app.get("/", (request, reply) => {
  reply.send("Hello World");
});
app.register(FastifyFormbody, {});
import userRouter from "./routes/user.routes.js";
import postRouter from "./routes/post.routes.js";

app.register(userRouter, { prefix: "/api/v1/user" });

app.register(
  async function (fastify) {
    fastify.register(verifyJWT);
    fastify.register(postRouter);
  },
  { prefix: "/api/v1/post" }
);
app.setErrorHandler(errHandler);
export default app;
