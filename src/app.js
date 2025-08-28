import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

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

app.use((req,res,next)=>{
  console.log(`${req.method} ${req.url}`);
  console.log('Content-Type:',req.headers['content-type']);
  console.log('Body:',req.body);  
  next();
})

// routes import
import {
  healthCheckRouter,
  userRouter,
  videoRouter,
  commentRouter,
  likeRouter,
  playlistRouter,
  dashboardRouter,
  subscriptionRouter,
  tweetRouter,
} from "./routes/index.js";

// routes declaration
app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tweets", tweetRouter);

export default app;
