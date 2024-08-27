import { ApiError } from "../utils/ApiError.js";

const errHandler = (err, request, reply) => {
  console.log(err);
  if (err instanceof ApiError) {
    return reply.status(err.statuscode).send({
      success: err.success,
      statusCode: err.statuscode,
      message: err.message,
      errors: err.errors,
    });
  }

  return reply.status(500).send({
    success: false,
    message: "Internal Server Error",
    errors: [],
    statusCode: 500,
  });
};

export { errHandler };
