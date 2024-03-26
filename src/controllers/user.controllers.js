import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" ; 
import {User} from "../models/user.model.js" ; 
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken" ; 





 const generateAccessAndRefreshToken  = async(userId) => {
    try {
        
       const user  = await User.findById(userId)
    
       const accessToken = user.generateAccessToken()
       const refreshToken = user.generateRefreshToken()

       console.log(accessToken)
       console.log(refreshToken)

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave : false})

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
     console.log(user);

     if (!user) {
        throw new ApiError(401 , "User does not exist")
     }
    
     const isPasswordValid = await user.isPasswordCorrect(password)

     if (!isPasswordValid) {
        throw new ApiError (405  , "Invalid User credentials")
     }

    const {refreshToken , accessToken}  = await  generateAccessAndRefreshToken(user._id)
    

    const loggedInUser = await  User.findById(user._id).select(
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
            200, 
            {
                user: loggedInUser ,accessToken , refreshToken
            },
            "User logged In Successfully"
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

const refreshAccessToken = asyncHandler( async ( req , res ) => {
    try {
        const incomingRefreshToken  = req.cookies?.refreshToken  || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError (401 , "Invalid Refresh Token")
        }

        const decodedToken =  jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)

        const user  = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError (401 , "Invalid Refresh Token")
        }

        if(incomingRefreshToken !== user.refreshToken){
            throw new ApiError("Invalid Refresh Token")
        }

        const {accessToken , newRefreshToken} = await generateAccessAndRefreshToken(user._id)
        const options = {
            httpOnly : true , 
            secure : true 
        }

    return res
    .status(200)
    .cookie("accessToken" , accessToken , options)
    .cookie("refreshToken" , newRefreshToken , options)
    .json(
        new ApiResponse (
            200 , 
            {
                accessToken ,refreshToken : newRefreshToken
            } , 
            "Access Token refreshed Successfully "
        )
    )

    } catch (error) {
        throw new ApiError(401 , error?.message || "Invalid Refresh Token")
    }
})


const changeCurrentPassword = asyncHandler(async (req ,res) => {

    const {oldPassword  , newPassword }  = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError (400 ,  "Invalid Old Password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave : false})

    return res
    .status(200)
    .json(
        new ApiResponse (200 , {} , "Password Changed Successfully")
    )

} )

const getCurrentUser = asyncHandler(async(req, res) => {
    return  res
    .status(200)
    .json(
        new ApiResponse (200 , req.user , "Current user fetched Succes")
    )
})

const updateAccountDetails = asyncHandler(async(req , res )=> {

    const {fullName , email } = req.body 

    if(!fullName || !email){
        throw new ApiError(400 , "All fields required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id , 
        {
            $set : {
                fullName , 
                email ,
            }
        } , 
        {
            new : true
        }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse (
            200 , user , "Account details updated succesfully"
        )
    )

})


const updateAvatar  = asyncHandler(async(req ,res ) => {
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400 , "Avatar file is missing ")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400 , "Error while uploading Avatar ")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id ,
        {
           $set : {
                avatar  : avatar.url
            }
        } , 
        {new  : true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200 ,user , "Avatar updated Succesfully")
    )

})

const updateCoverImage  = asyncHandler(async(req , res ) => {
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400 , "Avatar file is missing ")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400 , "Error while uploading Cover Image ")
    }

    const user  = await User.findByIdAndUpdate(
        req.user?._id ,
        {
           $set : {
                avatar  : coverImage.url
            }
        } , 
        {new  : true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200 , user , "Cover Image updated Succesfully")
    )

})



export {
    registerUser , 
    loginUser , 
    logoutUser ,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser ,
    updateAccountDetails ,
    updateAvatar ,
    updateCoverImage
    
}