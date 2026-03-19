import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import validator from "validator";
import { User } from "../models/user.model.js";
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

export { registerUser };
