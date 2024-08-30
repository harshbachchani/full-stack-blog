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

const Socket = app.io.of("/socket");
Socket.on("connect", (node) => {
  console.log("/socket is connected");
  node.emit("1234", "Hello there I am socket");
  node.on("disconnect", () => {
    console.log("disconnected");
  });
});
app.io.of("/testing").on("connect", (socket) => {
  console.log("/socket is connected");
  socket.emit("1234", "Hello there I am socket");
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
});
// app.ready((err) => {
//   if (err) throw err;
//   app.io.of("/").on("connect", (socket) => {
//     console.info("Socket connected!", socket.id);
//     socket.on("disconnect", () => {
//       console.info("Socket disconnected!", socket.id);
//     });
//   });
// });
app.setErrorHandler(errHandler);
export default app;
