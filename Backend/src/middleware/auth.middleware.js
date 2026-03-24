import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const jwtVerify = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedData._id).select(
      "-password -refreshToken",
    );
    if (!user) {
      throw new ApiError(400, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error || "Invalid access token");
  }
};

export const isEmployer = (req, res, next) => {
  if (req.user && req.user.role === "employer") {
    next();
  } else {
    next(new ApiError(403, "Access denied. Only employers can post jobs."));
  }
};

export const isJobseeker = (req, res, next) => {
  if (req.user && req.user.role === "jobseeker") {
    next();
  } else {
    next(new ApiError(403, "Access denied. Only employers can post jobs."));
  }
};
