import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    
    if(!title || !description){
        throw new ApiError(400,"Title and description are required");
    }

    const videoLocalPath = req.files.videoFile[0].path;
    const thumbnailLocalPath = req.files.thumbnail[0].path;

    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video and thumbnail are required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile || !thumbnail){
        throw new ApiError(500, "Failed to upload files to cloudinary");
    }
    console.log(videoFile);
    
    const video =await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        duration: videoFile.duration,
        owner: req.user._id
    })

    const createdVideo = await Video.findById(video._id)

    if(!createdVideo){
      throw new ApiError(500, "Failed to create video");
    }
    return res.status(201).json(
        new ApiResponse(201, createdVideo, "Video created successfully")
    );
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}