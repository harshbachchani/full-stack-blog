import { errHandler } from "./middlewares/err.middleware.js";
import Fastify from "fastify";
import cors from "@fastify/cors";

const app = Fastify();

app.register(cors, {
  origin: process.env.CORS_ORIGIN,
});

app.get("/", (request, reply) => {
  reply.send("Hello World");
});

// import userRouter from "./routes/userRoutes.js";
// app.register(userRouter, { prefix: "api/v1/users" });

export default app;
