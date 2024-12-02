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
            new ApiResponse(200 , createdPlaylist , "Playlist created Successfully")
        )
    } catch (error) {
        throw new ApiError(404, `Failed to created Playlist due to ${error.message} ! Please try again`)
    }
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    //TODO: get user playlists
    console.log(userId)

    if (!isValidObjectId(userId)) {
        throw new ApiError(404, "failed to find User")
    }

    // const userPlaylists = await Playlist.find({
    //     owner: userId
    // })

    const userPlaylists = Playlist.aggregate()

    res.send(userPlaylists)

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist

    const deletedPlaylist = await Playlist.deleteMany({
        name : "chill"
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