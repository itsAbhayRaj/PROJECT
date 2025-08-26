import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files.videoFile[0].path;
  const thumbnailLocalPath = req.files.thumbnail[0].path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail are required");
  }

  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(500, "Failed to upload files to cloudinary");
  }
  console.log(videoFile);

  const video = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile.duration,
    owner: req.user._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new ApiError(500, "Failed to create video");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, createdVideo, "Video created successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId.trim())) {
    throw new ApiError(400, "Invalid video ID format");
  }

  const video = await Video.findById(videoId.trim());

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (!video.isPublished) {
    throw new ApiError(404, "Video is not pubished");
  }

  await Video.findByIdAndUpdate(videoId.trim(), {
    $inc: { views: 1 },
  });
  let userLike;
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { watchHistory: videoId.trim() },
    });
    userLike = await Like.findOne({
      user: req.user._id,
      video: videoId.trim(),
    });
  }

  const videoWithOwner = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId.trim()),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        isLiked: !!userLike,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, videoWithOwner[0], "Video fetched successfully")
    );
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required!");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId.trim())) {
    throw new ApiError(400, "Invalid video ID format");
  }

  const { title, description } = req.body;

  if (!title && !description) {
    throw new ApiError(400, "Nothing is given to Update!");
  }

  const video = await Video.findById(videoId.trim());

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Cannot Edit This Video!! NOT YOURS!!");
  }

  const updateVideo = await Video.findByIdAndUpdate(
    videoId.trim(),
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateVideo, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new ApiError(400, "Video Id is required!");
  }

  if (!mongoose.Types.ObjectId.isValid(videoId.trim())) {
    throw new ApiError(400, "Provide valid Video Id!");
  }

  const video = await Video.findById(videoId.trim());

  if (!video) {
    throw new ApiError(404, "Video not found!!");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "This is not your Video , can delete only yours !");
  }

  await Video.findByIdAndDelete(videoId.trim());

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required!");
  }
  if (!mongoose.Types.ObjectId.isValid(videoId.trim())) {
    throw new ApiError(400, "Invalid video ID format");
  }

  const video = await Video.findById(videoId.trim());

  if (!video) {
    throw new ApiError(404, "Video not found!");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only toggle status of your own videos!");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    videoId.trim(),
    {
      $set: {
        isPublished: !video.isPublished,
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video status toggled successfully")
    );
});

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const matchStage = {};
  if (query) {
    matchStage.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    matchStage.owner = new mongoose.Types.ObjectId(userId);
  }

  matchStage.isPublished = true;

  const sortStage = {};

  if (sortBy && sortType) {
    sortStage[sortBy] = sortType === "desc" ? -1 : 1;
  } else {
    sortStage.createdAt = -1;
  }

  console.log(matchStage);
  console.log(sortStage);

  const totalVideos = await Video.countDocuments(matchStage);

  const videos = await Video.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
    {
      $sort: sortStage,
    },
    {
      $skip: (parseInt(page) - 1) * parseInt(limit),
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  const totalPages = Math.ceil(totalVideos / parseInt(limit));
  const hasNextPage = parseInt(page) < totalPages;

  const responseData = {
    docs: videos,
    hasNextPage,
    totalPages,
    currentPage: parseInt(page),
    totalVideos,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, responseData, "Videos fetched successfully"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
