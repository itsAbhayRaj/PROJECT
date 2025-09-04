import { asyncHandler, ApiError, ApiResponse} from "../utils/index.js";
import { Video, Like, Playlist, Subscription} from "../models/index.js";
import mongoose from "mongoose";

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    // Get total videos count
    const totalVideos = await Video.countDocuments({ owner: userId });
    
    // Get total views
    const totalViews = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ]);
    
    // Get total subscribers
    const totalSubscribers = await Subscription.countDocuments({ channel: userId });
    
    // Get total likes on user's videos
    const totalLikes = await Like.countDocuments({
        video: { $in: await Video.find({ owner: userId }).distinct('_id') }
    });
    
    // Get total playlists
    const totalPlaylists = await Playlist.countDocuments({ owner: userId });
    
    // Get recent videos
    const recentVideos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title thumbnail views createdAt');
    
    // Get top performing videos
    const topVideos = await Video.find({ owner: userId })
        .sort({ views: -1 })
        .limit(5)
        .select('title thumbnail views createdAt');
    
    const stats = {
        totalVideos,
        totalViews: totalViews[0]?.totalViews || 0,
        totalSubscribers,
        totalLikes,
        totalPlaylists,
        recentVideos,
        topVideos
    };
    
    return res.status(200).json(
        new ApiResponse(200, stats, "Channel statistics fetched successfully")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user._id;
    
    const matchStage = { owner: userId };
    
    if (status === 'published') {
        matchStage.isPublished = true;
    } else if (status === 'unpublished') {
        matchStage.isPublished = false;
    }
    
    const videos = await Video.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                },
                createdAt: {
                    day: { $dayOfMonth: "$createdAt" },
                    month: { $month: "$createdAt" },
                    year: { $year: "$createdAt" }
                }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (parseInt(page) - 1) * parseInt(limit)
        },
        {
            $limit: parseInt(limit)
        }
    ]);
    
    const totalVideos = await Video.countDocuments(matchStage);
    
    return res.status(200).json(
        new ApiResponse(200, {
            videos,
            totalVideos,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalVideos / parseInt(limit))
        }, "Channel videos fetched successfully")
    );
});

const getChannelAnalytics = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { period = '30' } = req.query; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    // Get video views over time
    const videoViews = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                totalViews: { $sum: "$views" },
                videoCount: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    
    // Get subscriber growth over time
    const subscriberGrowth = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId),
                createdAt: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$createdAt"
                    }
                },
                newSubscribers: { $sum: 1 }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);
    
    // Get engagement metrics
    const engagementMetrics = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
                createdAt: { $gte: startDate }
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$views" },
                totalLikes: { $sum: { $size: "$likes" } },
                avgViewsPerVideo: { $avg: "$views" },
                avgLikesPerVideo: { $avg: { $size: "$likes" } }
            }
        }
    ]);
    
    const analytics = {
        period: `${period} days`,
        videoViews,
        subscriberGrowth,
        engagementMetrics: engagementMetrics[0] || {
            totalViews: 0,
            totalLikes: 0,
            avgViewsPerVideo: 0,
            avgLikesPerVideo: 0
        }
    };
    
    return res.status(200).json(
        new ApiResponse(200, analytics, "Channel analytics fetched successfully")
    );
});

export {
    getChannelStats,
    getChannelVideos,
    getChannelAnalytics
};