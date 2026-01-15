import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());

// import router

import authRouter from "./modules/auth/auth.routes.js";
import userRouter from "./modules/user/user.routes.js";
import subscriptionRouter from "./modules/subscription/subscription.routes.js";
import playlistRouter from "./modules/playlist/playlist.routes.js";
import videoRouter from "./modules/video/video.routes.js";
import likeRouter from "./modules/like/like.routes.js";
import commentRouter from "./modules/comment/comment.routes.js";
import dashboardRouter from "./modules/dashboard/dashboard.routes.js";
import tweetRouter from "./modules/tweet/tweet.routes.js";
import healthCheckRouter from "./modules/healthcheck/healthcheck.routes.js";

//declare routes

app.use("/api/v1/users", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);

// Global Error Handler
import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app };
