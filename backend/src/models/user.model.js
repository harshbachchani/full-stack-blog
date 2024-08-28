import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import Crypto from "crypto-js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, "FullName is required"],
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await Crypto.AES.encrypt(
    this.password,
    process.env.CRYPTO_SECRET_KEY
  ).toString();
  next();
});

userSchema.methods.isPassWordCorrect = async function (password) {
  const decryptedPassword = await Crypto.AES.decrypt(
    this.password,
    process.env.CRYPTO_SECRET_KEY
  ).toString(Crypto.enc.Utf8);

  return decryptedPassword == password;
};

userSchema.methods.generateAcessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
