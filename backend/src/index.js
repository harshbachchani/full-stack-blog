import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import connectDB from "./db/index.js";

connectDB()
  .then((value) => {})
  .catch((err) => {
    console.log("MongoDB connection Failed ", err);
  });
