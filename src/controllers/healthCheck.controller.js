
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
    try {
        res
        .status(200)
        .json(
            new ApiResponse(
                200 , 
                null ,
                "Everything is Working Fine"
            )
        )
    } catch (error) {
        throw new ApiError(400 , "SOMETHING WENT WRONG")
    }
})

export {
    healthcheck
    }
    
