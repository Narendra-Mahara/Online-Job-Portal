import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["jobseeker", "employer"],
      required: true,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    bio: {
      type: String,
      maxLength: 250,
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

//Hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
}); // we shouldn't use next() if we use async

//Check the password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Generate AccessToken
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

//Generate RefreshToken
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = model("User", userSchema);
