
import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const owner = req.user._id



        if (!isValidObjectId) {
            throw new ApiError(400, "Video Does not exist")
        }

        const isLiked = await Like.findOne({
            video: videoId,
            likedBy: owner
        })

        if (isLiked) {
            await Like.deleteOne({
                video: videoId,
                likedBy: owner
            })

            res
                .status(200)
                .json(
                    new ApiResponse(200, "Toggled video Like successfully")
                )
        } else {
            const LikedVideo = await Like.create({
                video: videoId,
                likedBy: owner
            })

            if (!LikedVideo) {
                throw new ApiError(400, "Error occured while liking Video")
            }

            res
                .status(200)
                .json(
                    new ApiResponse(200, LikedVideo, "Successfully Liked Video")
                )
        }


    } catch (error) {
        throw new ApiError(400, `Failed to toggle Video Like due to ${error.message}`)
    }
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    try {
        const { commentId } = req.params
        const likedBy = req.user._id

        if (!isValidObjectId) {
            throw new ApiError(400, "Comment Does not exist")
        }

        const isLiked = await Like.findOne({
            likedBy,
            comment: commentId
        })

        if (isLiked) {
            await Like.deleteOne({
                likedBy,
                comment: commentId
            })

            res
                .status(200)
                .json(
                    new ApiResponse(200, "Toggle Comment Like Succesfully")
                )
        } else {
            const likedComment = await Like.create({
                likedBy,
                comment: commentId
            })

            if (!likedComment) {
                throw new ApiError(400, "Error occured while liking comment")
            }

            res
                .status(200)
                .json(
                    new ApiResponse(200, likedComment, "Successfully Liked Comment")
                )
        }
    } catch (error) {
        throw new ApiError(400, `Failed to like Comment due to ${error.message}`)
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    try {
        const { tweetId } = req.params
        const likedBy = req.user._id

        if (!isValidObjectId) {
            throw new ApiError(400, "Comment Does not exist")
        }

        const isLiked = await Like.findOne({
            likedBy,
            tweet: tweetId
        })

        if (isLiked) {
            await Like.deleteOne({
                likedBy,
                tweet: tweetId
            })

            res
                .status(200)
                .json(
                    new ApiResponse(200, "Toggle Comment Like Succesfully")
                )
        } else {
            const likedTweet = await Like.create({
                likedBy,
                tweet: tweetId
            })

            if (!likedComment) {
                throw new ApiError(400, "Error occured while liking Tweet")
            }

            res
                .status(200)
                .json(
                    new ApiResponse(200, likedTweet, "Successfully Liked Comment")
                )
        }
    } catch (error) {
        throw new ApiError(400, `Failed to like Comment due to ${error.message}`)
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id
    
        const likedVideos = await Like.aggregate([
            {
                $match: {
                    likedBy: userId
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "videoDetails",
                    pipeline: [
                        {
                            $lookup: {
                                from : "users" , 
                                localField : "owner" , 
                                foreignField : "_id" , 
                                as : "ownerDetails" ,
                                pipeline : [
                                    {
                                        $project : {
                                            username : 1 ,
                                            _id : 0 
                                        }
                                    }
                                ]
    
                            }
                        } , 
                        {
                            $addFields : {
                                "ownerUsername" : {$first : "$ownerDetails.username"}
                            }
                        },
                        {
                            $project : {
                                owner : 0 ,
                                ownerDetails : 0 , 
                                __v : 0 , 
                                _id : 0
                            }
                        }
                    ]
    
                }
            },
            {
                $lookup : {
                    from : "users" , 
                    localField : "likedBy" , 
                    foreignField : "_id",
                    as : "likedBy"
                }
            },
            {
                $project : {
                    video : 0,
                    __v : 0
                }
            }
        ])
    
        if(!likedVideos?.length){
            throw new ApiError(400 , "Not found any Liked Videos")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200 , likedVideos , "SuccessFully fetched Liked Videos")
        )
    } catch (error) {
        throw new ApiError(400, `Failed to get liked Videos due to ${error.message}`)
        
    }
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
