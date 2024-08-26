import { errHandler } from "./middlewares/err.middleware.js";
import Fastify from "fastify";

const app = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

export default app;
