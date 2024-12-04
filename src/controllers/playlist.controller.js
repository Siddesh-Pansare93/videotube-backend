import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {

    //TODO: create playlist

    try {
        const { name, description } = req.body
        const owner = req.user._id

        console.log("req received")


        if (!name || !description) {
            throw new ApiError(404, "Name and description of the playlist is required")
        }

        const createdPlaylist = await Playlist.create({
            name,
            description,
            owner
        })
        console.log(createdPlaylist)

        if (!createdPlaylist || createdPlaylist.length == 0) {
            throw new ApiError(200, "Playlist creation Failed due to some internal issue")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, createdPlaylist, "Playlist created Successfully")
            )
    } catch (error) {
        throw new ApiError(404, `Failed to created Playlist due to ${error.message} ! Please try again`)
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params
        //TODO: get user playlists
    
    
        if (!isValidObjectId(userId)) {
            throw new ApiError(404, "failed to find User")
        }
    
        // const userPlaylists = await Playlist.find({
        //     owner: userId
        // })
    
        const userPlaylists = await Playlist.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "Videos",
                    foreignField: "_id",
                    as: "playlistVideos",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "ownerDetails",
                                pipeline: [
                                    {
                                        $project: {
                                            username: 1,
                                            email: 1
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            $addFields: {
                                "ownerUsername": { $first: "$ownerDetails.username" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                videoFile: 1,
                                thumbnail: 1,
                                title: 1,
                                ownerUsername: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "playlistOwnerDetails",
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                username: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields : {
                    playlistOwnerName :{ $first : "$playlistOwnerDetails.username"}
                }
            },
            {
                $project : {
                    _id : 0 , 
                    name : 1 , 
                    playlistVideos : 1 ,
                    playlistOwnerName : 1 , 
                    description : 1 ,
                }
            }
        ])

        if(!userPlaylists){
            throw new ApiError(400 ,"User Playlist not Found")
        }

        res
        .status(200)
        .json(
            new ApiResponse(200 , userPlaylists , "User Playlist successfully found")
        )
    } catch (error) {
        throw new ApiError(400  , "Failed to get User Playlist")
    }

    

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    console.log(userId)
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const owner = req.user._id

    if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
        throw new ApiError("Playist or Video with Following ID not found")
    }

    const playlistAfterAddingVideo = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner
        },
        {
            $addToSet: {
                Videos: videoId
            }
        },
        {
            new: true
        }
    )

    res.send(playlistAfterAddingVideo)

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    const deletedPlaylist = await Playlist.deleteMany({
        name: "chill"
    })

    res.send(deletedPlaylist)
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}