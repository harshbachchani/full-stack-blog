import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./db/index.js";
import app from "./app.js";
connectDB()
  .then((value) => {
    app.listen({ port: process.env.PORT }, function (err, address) {
      if (err) {
        console.log(err);
        process.exit(1);
      } else {
        console.log(`Server listening on ${address}`);
      }
    });
  })
  .catch((err) => {
    console.log("MongoDB connection Failed ", err);
  });
