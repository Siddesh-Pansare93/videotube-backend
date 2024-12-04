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
                                ownerUsername: 1,
                                isPublished: 1,
                                duration: 1,
                                views: 1
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
                $addFields: {
                    playlistOwnerName: { $first: "$playlistOwnerDetails.username" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: 1,
                    playlistVideos: 1,
                    playlistOwnerName: 1,
                    description: 1,
                }
            }
        ])

        if (!userPlaylists) {
            throw new ApiError(400, "User Playlist not Found")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, userPlaylists, "User Playlist successfully found")
            )
    } catch (error) {
        throw new ApiError(400, "Failed to get User Playlist")
    }



})

const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params

        if (!isValidObjectId) {
            throw new ApiError(400, "Playlist does not exist with this id")
        }

        const playlist = await Playlist.findById(playlistId)
            .populate({
                path: "Videos",
                populate: {
                    path: "owner",
                    select: "username -_id"
                },
                select: "-_id -__v"
            })
            .populate({
                path: "owner",
                select: "username -_id"
            })
            .select(" -_id -__v")



        if (!playlist) {
            throw new ApiError(400, "Playlist not found")
        }

        res
            .status(400)
            .json(
                new ApiResponse(200, playlist, "Playlist found Successfully")
            )

    } catch (error) {
        throw new ApiError(400, `Failed to get Playlist due to ${error} `)
    }

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
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

        if (!playlistAfterAddingVideo) {
            throw new ApiError(400, "Error Occured While adding Video")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, playlistAfterAddingVideo, "Video added to playlist successfully")
            )
    } catch (error) {
        throw new ApiError(400, `Failed to add Video to playlist due to ${error.message}`)
    }

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params
        const owner = req.user._id
        // TODO: remove video from playlist

        if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
            throw new ApiError(400, "Playlist or Video does not exist")
        }

        const updatedPlaylist = await Playlist.findOneAndUpdate(
            {
                _id: playlistId,
                owner
            }, {
            $pull: {
                Videos: videoId
            }
        },
            {
                new: true
            }
        )

        if (!updatedPlaylist) {
            throw new ApiError(400, "Not able to remove Video from Playlist")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, updatedPlaylist, "Video removed successfully from playlist")
            )
    } catch (error) {
        throw new ApiError(400, `Failed to remove Video from Playlist due to ${error.message}`)
    }


})

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        const owner = req.user._id

        if (!isValidObjectId(playlistId)) {
            throw new ApiError(400, "Playlist does not exist with this id")
        }

        const deletedPlaylist = await Playlist.findOneAndDelete({
            _id: playlistId,
            owner
        })

        if (!deletedPlaylist) {
            throw new ApiError(400, "Failed to delete playlist")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, deletedPlaylist, "SuccessFully deleted Playlist")
            )
    } catch (error) {
        throw new ApiError(400, `Failed to delete Playlist due to ${error.message}`)
    }
})

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params
        const { name, description } = req.body
        const owner = req.user._id

        if ([name, description].some((feild) => !feild || feild?.trim() === "")) {
            throw new ApiError(400, "All Feilds are required")
        }

        const updatedPlaylist = await Playlist.findOneAndUpdate(
            {
                _id: playlistId,
                owner
            },
            {
                $set: {
                    name,
                    description
                }
            },
            {
                new: true
            }
        )

        if (!updatePlaylist) {
            throw new ApiError(400, "Error Occurred While updating Playlist details")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, updatedPlaylist, "Successfully updated Playlist details")
            )
    } catch (error) {
        throw new ApiError(400, `Failed to update Playlist due to ${error.message}`)
    }
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