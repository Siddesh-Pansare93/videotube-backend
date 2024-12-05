
import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    console.log(channelId)
    // TODO: toggle subscription

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Channel not found")
    }

    const userId = req.user._id

    const isSubscribed = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    if (isSubscribed) {
        await Subscription.deleteOne({ subscriber: userId, channel: channelId })
        res.status(200).json(
            new ApiResponse({ subscribed: false }, "Subscription cancelled successfully")
        )
    }else{
        const subscribtion = await Subscription.create({
            subscriber: userId,
            channel: channelId
        })
    
        if (!subscribtion) {
            throw new ApiError(400, "Failed to subscribe")
        }
        res.status(200).json(
            new ApiResponse(200, { subscribed: true }, "Subscription toggled successfully")
        )
    }

    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    try {
        const { channelId } = req.params

        const subscribers = await Subscription.aggregate([
            {
                $match: { channel: new mongoose.Types.ObjectId(channelId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscribers",
                    pipeline :[
                        {
                            $project : {
                                username : 1 ,
                                avatar : 1 ,  
                                _id : 0 

                            }
                        }
                    ]
                }
            },
            {
                $addFields : {
                    "subscribersList" : {
                        $first : "$subscribers"
                    }
                }
            },  
            {
                $project: {
                    subscribersList :1 , 
                    _id : 0 
                }
            } ,
        ])

        console.log(subscribers)
        if (!subscribers) {
            res.status(400).json("Not able to find any subscriber")
        }

        const subscribersList = subscribers.map(item => item.subscribersList)

        res.status(200).json(
            new ApiResponse(200 , subscribersList, "user channel subscribers fetched Successfully")
        )
    } catch (error) {
        throw new ApiError(400, "Failed to get subscribers")
    }
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    try {
        const { subscriberId } = req.params
    
    
        const subscribedChannels = await Subscription.aggregate([
            {
                $match: {subscriber: new mongoose.Types.ObjectId(subscriberId)},
            },
            {
                $lookup: {
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "subscribedChannels",
                    pipeline : [
                        {
                            $project: {
                                username: 1 , 
                                // email : 1 ,
                                avatar : 1 , 
                                _id : 0
    
                            }
                        } ,
                    ]
                },
            },
            {
                $addFields : {
                    "channel" : {$first : "$subscribedChannels"}  
                }
            },
            {
                $project : {
                    "channel" : 1 , 
                    "_id" : 0
                }
            }
           
           
        ])

        // res.send(subscribedChannels)
    
        if(!subscribedChannels){
            throw new ApiError(400 , "Failed to find Subscribed Channels")
        }
        const channelList = subscribedChannels.map(item => item.channel)



        res
        .status(200)
        .json(
            new ApiResponse(200 , channelList , "SuccessFully fetched user Subscribed Channels")
        )
    } catch (error) {
        throw new ApiError(400 , "Failed to fetch User Subscribed Channel")
    }
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
