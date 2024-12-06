
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    try {

    const channelId = req.user._id

    // TOTAL SUBSCRIBERS : 

    // const subscriberCount = await Subscription.find({channel : channelId})
    // const totalSubscribers = subscriberCount?.length ? subscriberCount.length : 0

    // alternate approach
    const subscriberCount = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $count: "subscribers"
        }
    ])
    const totalSubscribers = subscriberCount?.length ? subscriberCount[0].subscribers : 0


    // TOTAL VIDEOS :

    const videosCount = await Video.find({ owner: channelId })

    const totalVideos = videosCount?.length ? videosCount.length : 0


    //TOTAL LIKES : 

    console.log(channelId)
    const likesCount = await Like.aggregate([
        {
            $match: {
                video: {
                    $in: await Video.find({ owner: new mongoose.Types.ObjectId(channelId) }).distinct('_id')
                }
            }
        },
        {
            $count: "likes"
        }
    ])

    const totalLikes = likesCount?.length ? likesCount[0].likes : 0


    //TOTAL VIEWS : 

    const viewsCount = await Video.aggregate([
        {
            $match : {
                owner : channelId
            }
        },
        {
            $group :{
                _id : null , 
                views : { $sum : "$views"}
            }
        },
        {
            $project : {
                _id : 0 
            }
        }
    ])

    const totalViews = viewsCount?.length ?  viewsCount[0].views : 0

    const channelStats = {
        totalLikes,
        totalSubscribers ,
        totalVideos,
        totalViews
    }

    res
    .status(200)
    .json(
        new ApiResponse(200 , channelStats , "Successfully fetched channel stats" )
    )
    } catch (error) {
        throw new ApiError(400, `Failed to get channel Stats due to ${error.message}`)
    }
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    try {
        const channelId = req.user._id

        if (!isValidObjectId(channelId)) {
            throw new ApiError(400, "Channel does not exist")
        }

        const channelVideos = await Video.find(
            {
                owner: channelId
            }
        ).populate({ path: "owner", select: "username" })

        if (!channelVideos?.length) {
            throw new ApiError(400, "No Videos Found for this channel")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, channelVideos, "Successfully found ChannelVideos")
            )
    } catch (error) {
        throw new ApiError(400, `Failed to get channel Videos due to ${error.message}`)

    }
})

export {
    getChannelStats,
    getChannelVideos
}
