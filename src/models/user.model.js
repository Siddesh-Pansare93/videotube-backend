import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    // id : {
    //     type : String , 
    //     required : true 
    // } , 
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,     // cloudinary url    
        required: true
    },
    coverImage: {
        type: String,   //cloudinary url
    },
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    avatar: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        
    }
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();     //passwod modify hua hai ki nhi check karne ke liye 
   
    this.password = await bcrypt.hash(this.password, 10)
    next()
})



userSchema.methods.isPasswordCorrect = async function (password) {     // isPasswordCorrect yeh humnne banya hua method hai
                                                                      //  methods userSchema ek object hai jiske undar hum alag alag methods inject kar sakte hai
    return await bcrypt.compare(password, this.password)                     // yeh true-false retuen karega compare karke  
}



// -----Generating jwt (access and refresh) tokens--------

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(                                                    // isko 3 chize chaiye {payload (data)} , token-secret ,{expiry}
        {
            _id: this.id,
            username: this.username,
            email: this.email,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
     return jwt.sign(                                                    // access token ki tarah hi generate hoga bas isme payload (data) kam rehta hai
        {
            _id: this.id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
