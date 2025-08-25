import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true , limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());

// routes import
import healthCheckRouter from './routes/healthCheck.routes.js';
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import tweetRouter from './routes/tweet.routes.js';

// routes declaration
app.use('/api/v1/healthCheck', healthCheckRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter)
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/playlist', playlistRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/tweets', tweetRouter);

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 100MB'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files uploaded'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field'
            });
        }
    }
    
    if (error.message) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    return res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

export default app;