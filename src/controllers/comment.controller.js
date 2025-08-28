import mongoose from "mongoose";
import { ApiError, asyncHandler, ApiResponse } from "../utils/index.js";
import { Comment, Video } from "../models/index.js";

const addComment = asyncHandler( async (req, res) => {
  
    const { videoId } = req.params;
    const { content } = req.body;

    if(!videoId){
        throw new ApiError(400,"Video Id is required");
    }
    
    if(!content){
        throw new ApiError(400,"Comment Content is required");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }

    const comment = await Comment.create({
        content,
        owner: req.user._id,
        video: videoId
    })

    const createdComment = await Comment.findById(comment._id).populate("owner", "fullName username avatar");

    return res.status(200).json(
        new ApiResponse(200, createdComment, "Comment added successfully")
    );


} )

const updateComment = asyncHandler( async (req, res) => {
  
    const { commentId } = req.params;
    const { content } = req.body;

    if(!commentId){
        throw new ApiError(400,"Comment Id is required");
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }

    if(!content){
        throw new ApiError(400,"Comment Content is required");
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You can only update your own comments");
    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        content
    }, {new: true}).populate("owner", "fullName username avatar");

    return res.status(200).json(
        new ApiResponse(200, updatedComment, "Comment updated successfully")
    );
})

const deleteComment = asyncHandler( async (req, res) => {
  
    const { commentId } = req.params;

    if(!commentId){
        throw new ApiError(400,"Comment Id is required");
    }

    const comment = await Comment.findById(commentId);
    if(!comment){
        throw new ApiError(404,"Comment not found");
    }

    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You can only delete your own comments");
    }

    await Comment.findByIdAndDelete(commentId);

    return res.status(200).json(
        new ApiResponse(200, {}, "Comment deleted successfully")
    );
})

const getComments = asyncHandler( async (req, res) => {
  
    const { videoId } = req.params;
    const {page = 1, limit = 10} = req.query;

    if(!videoId){
        throw new ApiError(400,"Video Id is required");
    }

    const video = await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }

    const comments = await Comment.find({video: videoId})
    .sort({createdAt: -1})
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("owner", "fullName username avatar");

    return res.status(200).json(
        new ApiResponse(200, comments, "Comments fetched successfully")
    );

})
export {
    addComment,
    updateComment,
    deleteComment,
    getComments
}
