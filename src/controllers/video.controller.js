import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    try {
        // TODO: get video, upload to cloudinary, create video
        const { title, description } = req.body
        // console.log(req.body)
        console.log(req.files)



        if (!title || !description) {
            throw new ApiError(400, "title and description of video is required")
        }


        const videoLocalPath = req.files?.video[0].path

        if (!videoLocalPath) {
            throw new ApiError(400, "Video is required")
        }


        let thumbnailLocalPath;
        if (req.files && Array.isArray(req.files?.thumbnail) && req.files?.thumbnail.length > 0) {
            thumbnailLocalPath = req.files?.thumbnail[0].path
        }

        //uploading files in clondianry

        const videoDetails = await uploadOnCloudinary(videoLocalPath)
        const thumbnailDetails = await uploadOnCloudinary(thumbnailLocalPath)


        // taking only needed info from cloudinary response 
        const videoUrl = videoDetails.url
        const videoDuration = videoDetails.duration
        const thumbnailUrl = thumbnailDetails.url

        // Creating Video document in DB 
        const PublishedVideo = await Video.create({
            videoFile: videoUrl,
            title,
            description,
            duration: videoDuration,
            thumbnail: thumbnailUrl,
            isPublished: true,
            owner: req.user._id
        })

        if (!PublishedVideo) {
            throw new ApiError(400, "Failed to Upload video")
        }

        res
            .status(200)
            .json(
                new ApiResponse(200, PublishedVideo, "Video Published Succesfully")
            )

    } catch (error) {
        throw new ApiError(400, `Failed to publish a video due to ${error.message} ! Please try again`)
    }
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    console.log(videoId)

    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "Failed to find Video")
    }

    const foundVideo = await Video.findById(videoId)

    if (!foundVideo) {
        throw new ApiError(400, "Video Not Found")
    }

    res
        .status(200)
        .json(
            new ApiResponse(200, foundVideo, "Video Found Successfully")
        )
})

const updateVideo = asyncHandler(async (req, res) => {
  try {
      const { videoId } = req.params
      const owner  =  req.user._id
  
      if (!isValidObjectId(videoId)) {
          throw new ApiError(404, "Failed Update : Can't find video with that id")
      }
  
      const { title, description } = req.body
  
      if ([title, description].some((feild) => !feild || feild?.trim() === "")) {
          throw new ApiError(400, "All fields are required")
      }
  
      const thumbnailLocalPath = req.file?.path
      if(!thumbnailLocalPath){
          throw new ApiError(400, "Thumbnail is required")
      }
  
     
  
      const oldVideo = await Video.findById(videoId)
  
      const deleteOldThumbnail = deleteFromCloudinary(oldVideo.thumbnail)
  
      if (!deleteOldThumbnail) {
          throw new ApiError(500, "Server Issue : Unable to update Thumbanil")
      }
  
      const updatedThumbnail = await uploadOnCloudinary(thumbnailLocalPath)
      console.log(updatedThumbnail.url)
      if(!updatedThumbnail){
          throw new ApiError(500 , "Server Issue : Failed to Update thumbail")
      }
  
  
      const updatedDetails = await Video.findOneAndUpdate(
          {
              _id : videoId , 
              owner 
          },
          {
              $set : {
                  thumbnail : updatedThumbnail.url ,
                  title , 
                  description
              }
          }, 
          {
              new : true
          }
      )
  
      if(!updatedDetails){
          throw new ApiError(400 , "Failed to Update Video Details in Database")
      }
  
      res
      .status(200)
      .json(
          new ApiResponse(200 , updatedDetails , "Video Details Updated Successfully")
      )
  } catch (error) {
    throw new ApiError(400 , `Faield to Update Video Details due to ${error.message} : Please Try again after sometime`)
  }
})

const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const { videoId } = req.params
        const owner = req.user._id
        //TODO: delete video
    
        if (!isValidObjectId) {
            throw new ApiError(404, "Video Does not Find")
        }
    
        const deletedVideo = await Video.findOneAndDelete(
            {
                _id: videoId,
                owner
            }
        )
    
        if (!deletedVideo) {
            throw new ApiError(400, "Failed to delete Event")
        }
    
        res
            .status(200)
            .json(
                new ApiResponse(200, deleteVideo, "video deleted successfully")
            )
    } catch (error) {
        throw new ApiError(400 , "Failed to delete Video")
    }
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    try {
    const { videoId } = req.params
    const owner = req.user._id


    if (!isValidObjectId(videoId)) {
        throw new ApiError(404, "Failed to Find Video")
    }

    const video = await Video.findOne({
        _id: videoId,
        owner
    })

    if (!video) {
        throw new ApiError(400, "Video Not Found")
    }

    video.isPublished = !video.isPublished

    const updatedVideo = await video.save()

    res
        .status(200)
        .json(
            new ApiResponse(200, updatedVideo, "Toggled Publish status successfully")
        )
    } catch (error) {
        throw new ApiError(400 , "Failed To toggle Publish Status")
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}