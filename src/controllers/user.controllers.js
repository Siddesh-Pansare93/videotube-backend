import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" ; 
import {User} from "../models/user.model.js" ; 
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

 const generateAccessAndRefreshToken  = async(userId) => {
    try {
       const user  = await  User.findById({userId})
       const accessToken = user.generateAccessTokens()
       const refreshToken = user.generateRefreshToken()

       user.refreshToken = refreshToken
       user.save({validateBeforeSave : false})

       return {accessToken , refreshToken}
    } catch (error) {
        throw new ApiError("something went wrong while generating Access and Refresh Tokens")
    }
 }


const registerUser = asyncHandler( async(req , res) =>{
    const {username , fullName  , email , password}  = req.body 
    

    if (
        [ email , username , password].some((fields) => fields?.trim()==="")
    ) {
        throw new ApiError(400 , "All fields are required")
    }


    const existedUser = await User.findOne({
        $or : [{username} , {email}]
    })
    

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

const loginUser = asyncHandler(async(req ,res ) =>{

    const { username , email , password } = req.body

    if(!(username || email)){
        throw new ApiError (400 , "Username or email required")
    }


    const user = await User.findOne(
        {
         $or : [{email} , {username}] 
        }   
     )

     if (!user) {
        throw new ApiError(401 , "User does not exist")
     }
    
     const isPasswordValid = await user.isPasswordCorrect(password)

     if (!isPasswordValid) {
        throw new ApiError (405  , "Invalid User credentials")
     }

    const {refreshToken , accessToken}  = await  generateAccessAndRefreshToken(user._d)

    const loggedInUser = User.findById(user._id).select(
        "-password -refreshToken"
    )  

    const options = {
        httpOnly : true , 
        secure : true
    }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , refreshToken , options)
    .json(
        new ApiResponse(
            200 , 
            {
                user : loggedInUser , accessToken , refreshToken 
            },
            "User Logged In Successfully "
        )
    )

})

const logoutUser = asyncHandler(async(req ,res)=> {
   await  User.findByIdAndUpdate(
        req.user._id , 
        {
            $set : {refreshToken : ""}
        },
        {
            new : true
        } , 
    )
        const options = {
            httpOnly : true , 
            secure : true
        }
    
        res.
        status(200)
        .clearCookie("accessToken" , options)
        .clearCookie("refreshToken" , options)
        .json(
            new ApiResponse (
                200 , {} , "User Logged Out "
            )
        )
    })


export {
    registerUser , 
    loginUser , 
    logoutUser
}