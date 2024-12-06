
import mongoose, { isValidObjectId } from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    try {
        const {videoId} =  req.params
        const owner = req.user._id
        const {content} = req.body

        if(!isValidObjectId){
            throw new ApiError(400 , "Video does not exist")
        }

        const comment =  await Comment.create({
            video : videoId , 
            owner , 
            content
        })

        if(!comment){
            throw new ApiError(400 , "Something went wrong while adding comment")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200 ,  comment , "Successfullly added Comment")
        )
    } catch (error) {
        throw new ApiError(400 , `Failed to add Comment due to ${error.message}`);
    }
})

const updateComment = asyncHandler(async (req, res) => {
    try {
        const {commentId} =  req.params
        const { content } = req.body

        if(!isValidObjectId){
            throw new ApiError(400 , "Comment does not exist")
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId , 
            {
                $set : {content}
            },
            {
                new : true 
            }
        )

        if(!updatedComment){
            throw new ApiError(400 , "Something went wrong while updating comment"); 
        }

        res
        .status(200)
        .json(
            new ApiResponse(200 , updatedComment , "Successfully updated comment")
        )
    } catch (error) {
        throw new ApiError(400 , `Failed to update Comment due to ${error.message}`);
        
    }
})

const deleteComment = asyncHandler(async (req, res) => {
    try {
        const {commentId} =  req.params

        if(!isValidObjectId){
            throw new ApiError(400 , "Comment does not exist")
        }

        const deletedComment = await Comment.findByIdAndDelete( commentId )

        if(!deletedComment){
            throw new ApiError(400 , "Something went wrong while updating comment"); 
        }

        res
        .status(200)
        .json(
            new ApiResponse(200 , deletedComment , "Successfully deleted comment")
        )
    } catch (error) {
        throw new ApiError(400 , `Failed to delete Comment due to ${error.message}`);
    }
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
