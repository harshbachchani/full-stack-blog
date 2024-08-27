import { errHandler } from "./middlewares/err.middleware.js";
import Fastify from "fastify";
import FastifyFormbody from "@fastify/formbody";
import cors from "@fastify/cors";
const app = Fastify();

app.register(cors, {
  origin: process.env.CORS_ORIGIN,
});

app.get("/", (request, reply) => {
  reply.send("Hello World");
});
app.register(FastifyFormbody, {});
import userRouter from "./routes/user.routes.js";

app.register(userRouter, { prefix: "/api/v1/user" });
app.setErrorHandler(errHandler);
export default app;
