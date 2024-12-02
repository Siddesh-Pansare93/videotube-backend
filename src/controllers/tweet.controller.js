import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: validating user before delete and update -------- Remaining

    try {
        const { content } = req.body
        const owner = req.user._id
    
        if (!content || content.trim() == "") {
            throw new ApiError(400, "Please fill in all fields")
        }
    
    
    
        const tweet = await Tweet.create({
            content,
            owner
        })
    
        if (!tweet) {
            throw new ApiError(400, "Failed to create Tweet")
        }
    
        res
            .status(200)
            .json(ApiResponse.success(tweet, "Tweet created successfully"))
        } catch (error) {
            if (error.name === "ValidationError") {
                throw new ApiError(400, error.message)
                }
                if (error.name === "MongoError") {
                    throw new ApiError(400, "Failed to create Tweet")
                }
        }
    })
    

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    try {
        const userId = req.user._id
    
        const userTweets = await Tweet.find(
            {
                owner: userId
            })
    
        if (userTweets.length == 0) {
            throw new ApiError(404, "No tweets found")
        }
    
        res
            .status(200)
            .json(
                new ApiResponse.success(userTweets, "User tweets found")
            )
    } catch (error) {
        throw new ApiError(400 , "Error in finding User Tweets")
    }
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet

    try {
        const tweetId  = req.params
        const content  = req.body
    
        if(!content || content.trim() == ""){
            throw new ApiError(400, "Content is required")
        }
    
        const updatedTweet  = await Tweet.findByIdAndUpdate(
            tweetId,
            {
                $set : {
                    content
                }
            },
            {
                new  :true
            }
        )
    
        if(!updatedTweet){
            throw new ApiError(404, "Failed to update tweet ")
        }

        res
        .status(200)
        .json(
            new ApiResponse.success(updatedTweet, "Tweet updated successfully")
        )
    
    } catch (error) {
        throw new ApiError(400 , "Failed to Update ! please try again ")
    }

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet

    try {
        const tweetId = req.params
    
        const deletedTweet =  await Tweet.findByIdAndDelete(tweetId)

        if(!deletedTweet){
            throw new ApiError(404, "Failed to delete tweet ")
        }

    } catch (error) {
        throw new ApiError(400 , "Failed to delete ! please try again")
    }

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}