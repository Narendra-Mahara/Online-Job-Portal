import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Resume } from "../models/resume.model.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name?.trim() || !email?.trim() || !password?.trim() || !role?.trim()) {
    throw new ApiError(400, "All the fields are required");
  }

  //check if email is valid
  if (!validator.isEmail(email))
    throw new ApiError(400, "Invalid email format");

  //Check if user already exists
  const existedUser = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existedUser)
    throw new ApiError(400, "User with this email already exists");
  //Register user
  const user = await User.create({
    name,
    email: email.toLowerCase().trim(),
    password,
    role,
  });

  // Fetch the created user without the password field to send back
  const createdUser = await User.findById(user._id).select("-password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // SEND THE RESPONSE
  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email?.trim() || !password?.trim()) {
    throw new ApiError(400, "All fields are required!");
  }
  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    throw new ApiError(400, "User doesn't exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect password");
  }

  //Generate jwt AccessToken and RefreshToken
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully",
      ),
    );
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, address, phone, bio } = req.body;

    const updateData = {};

    if (name) updateData.name = name.trim();

    if (email) {
      if (!validator.isEmail(email)) {
        throw new ApiError(400, "Invalid email format");
      }

      const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        throw new ApiError(400, "Email already in use");
      }

      updateData.email = email.toLowerCase().trim();
    }

    if (address) updateData.address = address.trim();
    if (phone) updateData.phone = phone.trim();
    if (bio) updateData.bio = bio.trim();

    if (req.file?.path) {
      const cloudinaryUrl = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryUrl) {
        throw new ApiError(500, "Error uploading profile image");
      }

      updateData.profileImage = cloudinaryUrl;
    }

    if (Object.keys(updateData).length === 0) {
      throw new ApiError(400, "No data provided to update");
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res
      .status(500)
      .json(
        new ApiResponse(500, null, error.message || "Internal Server Error"),
      );
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role === "jobseeker") {
      await Resume.deleteMany({ user: userId });
      await Application.deleteMany({ applicant: userId });
    }

    if (req.user.role === "employer") {
      const employerJobs = await Job.find({ employer: userId });
      const jobIds = employerJobs.map((job) => job._id);
      if (jobIds.length > 0) {
        await Application.deleteMany({ job: { $in: jobIds } });
      }

      await Job.deleteMany({ employer: userId });
    }

    await User.findByIdAndDelete(userId);

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(
        new ApiResponse(
          200,
          {},
          "User and all associated data deleted successfully",
        ),
      );
  } catch (error) {
    console.error("Delete User Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Error while deleting user account"));
  }
};
export { registerUser, loginUser, logoutUser, updateProfile, deleteUser };
