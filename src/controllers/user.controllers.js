import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" ; 
import {User} from "../models/user.model.js" ; 
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

 


const registerUser = asyncHandler( async(req , res) =>{
    const {username , fullName  , email , password}  = req.body 
    console.log(email)

    if (
        [ email , username , password].some((fields) => fields?.trim()==="")
    ) {
        throw new ApiError(400 , "All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{username} , {email}]
    })
    console.log(existedUser) ;
    if(existedUser){
        throw new ApiError (409  , "User with email or Username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path ;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path ; 

    let coverImageLocalPath ; 
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath  = req.files.coverImage[0].path ;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is required") ; 
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400 , "Avatar file is required") ; 
    }

    const user = await User.create({
        fullName , 
        email , 
        avatar  : avatar.url , 
        coverImage : coverImage?.url || "" , 
        password , 
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    console.log(createdUser)

    if (!createdUser) {
        throw new ApiError(500 , "Something went Wrong While registering user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User created Sucessfully ")
    )
} )


export {registerUser}