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
app.get("/socket", (request, reply) => {
  console.log("Hii there on /gets");
  defaultNamespace.emit("123456", "Hii there I am socket");
  reply.send({ message: "Message sent to socket from /gets!" });
});
app.ready((err) => {
  if (err) throw err;

  const defaultNamespace = app.io.of("/socket");
  defaultNamespace.on("connect", (socket) => {
    console.info("Socket connected!", socket.id);
    socket.on("disconnect", () => {
      console.info("Socket disconnected!", socket.id);
    });
  });
});
app.setErrorHandler(errHandler);
export default app;
