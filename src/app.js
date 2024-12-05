import express from "express" ; 
import cookieParser from "cookie-parser";
import cors from "cors" ; 
const app = express() ; 


app.use(cors({
    origin : process.env.CORS_ORIGIN , 
    credentials : true
}))

app.use(express.json({limit : "16kb"})) 
app.use(express.urlencoded({extentended : true  , limit : "16kb "}))
app.use(express.static("public"))

app.use(cookieParser())


// import router 

import userRouter from "./routes/user.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import videoRouter from "./routes/video.routes.js"
import likeRouter from "./routes/like.routes.js"



//declare routes

app.use("/api/v1/users" , userRouter)
app.use("/api/v1/subscription" , subscriptionRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/video", videoRouter)
app.use("/api/v1/like", likeRouter)

export { app }