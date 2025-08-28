import mongoose from "mongoose";
import { ApiResponse, ApiError, asyncHandler } from "../utils/index.js";
import {Like} from "../models/index.js"

const toggleVideoLike = asyncHandler( async (req, res) => {
    
    const {videoId} = req.params;
    const userId = req.user._id;

    if(!videoId){
        throw new ApiError(400,"Video Id is required");
    }

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid video ID format");
    }

    const isLiked = await Like.findOneAndDelete({
        likedBy: userId,
        video: videoId
    })
    // console.log(isLiked);
    
    if(isLiked){
        // it is now disliked
        return res.status(200).json(new ApiResponse(200,{liked: false}, "Video disliked successfully"));
    }

    await Like.create({
        likedBy: userId,
        video: videoId
    })

    return res.status(200).json(new ApiResponse(200,{liked: true}, "Video liked successfully"));

});

const toggleCommentLike = asyncHandler( async (req, res) => {
    
    const {commentId} = req.params;
    const userId = req.user._id;

    if(!commentId){
        throw new ApiError(400,"Comment Id is required");
    }

    if(!mongoose.Types.ObjectId.isValid(commentId.trim())){
        throw new ApiError(400,"Invalid comment ID format");
    }

    const isLiked = await Like.findOneAndDelete({
        likedBy: userId,
        comment: commentId
    })

    if(isLiked){
        // it is now disliked
        return res.status(200).json(new ApiResponse(200,{liked: false}, "Comment disliked successfully"));
    }

    const like = await Like.create({
        likedBy: userId,
        comment: commentId
    })

    return res.status(200).json(new ApiResponse(200,{liked: true}, "Comment liked successfully"));

})

const toggleTweetLike = asyncHandler( async (req, res) => {
    
    const {tweetId} = req.params;
    const userId = req.user._id;

    if(!tweetId){
        throw new ApiError(400,"Tweet Id is required");
    }

    if(!mongoose.Types.ObjectId.isValid(tweetId.trim())){
        throw new ApiError(400,"Invalid tweet ID format");
    }

    const isLiked = await Like.findOneAndDelete({
        likedBy: userId,
        tweet: tweetId
    })

    if(isLiked){
        // it is now disliked
        return res.status(200).json(new ApiResponse(200,{liked: false}, "Tweet disliked successfully"));
    }

    const like = await Like.create({
        likedBy: userId,
        tweet: tweetId
    })

    return res.status(200).json(new ApiResponse(200,{liked: true}, "Tweet liked successfully"));

})

const getLikedVideos = asyncHandler( async (req, res) => {
    const { page = 1,limit = 10 } = req.query;

    const likedVideos = await Like.aggregate([
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(req.user._id),
                video: {$exists: true, $ne: null}
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline:[
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully !")
    )

})

export {
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getLikedVideos
}