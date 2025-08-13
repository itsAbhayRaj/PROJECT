import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // get user data from req.body
  // validate data - not empty
  // check if already exists - username , email
  // check for images , avatar required
  // upload images to cloudinary, avatar
  // create user object ~ create entry in db
  // remove password , refreshToken from response
  // check for creation
  // return response

  // Check if req.body exists and has the required fields
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(400, "Request body is missing or empty");
  }
  
  const { fullName, email, username, password } = req.body;
  if (
    [fullName, email, username, password].some((field) => !field || field?.trim() === "") // doubt if it will work
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists!!");
  }
  
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required!!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Error Not able to upload avatar!!");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    username: username.toLowerCase(),
    password,
  });
 
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error in user Registration");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

// const loginUser = asyncHandler( async (req,res) =>{});

export { registerUser };
