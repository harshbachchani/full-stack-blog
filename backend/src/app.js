import { errHandler } from "./middlewares/err.middleware.js";
import Fastify from "fastify";
import FastifyFormbody from "@fastify/formbody";
import cors from "@fastify/cors";
import verifyJWT from "./middlewares/auth.middleware.js";
const app = Fastify();
import multer from "fastify-multer";
import io from "fastify-socket.io";

app.register(cors, {
  origin: process.env.CORS_ORIGIN,
});
await app.register(io, {
  preClose: (done) => {
    console.log("disconnect");
    app.io.local.disconnectSockets(true);
    done();
  },
});

app.register(multer.contentParser);

app.get("/", (request, reply) => {
  console.log("Hii there ");
  app.io.emit("1234", "Hii there I am socket");
});
app.get("/gets", (request, reply) => {
  console.log("Hii there ");
  app.io.emit("123456", "Hii there I am socket");
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
app.ready((err) => {
  if (err) throw err;
  app.io.on("connect", (socket) =>
    console.info("Socket connected!", socket.id)
  );
});
app.setErrorHandler(errHandler);
export default app;
