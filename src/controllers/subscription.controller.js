import mongoose from "mongoose";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Subscription, User } from "../models/index.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId) {
    throw new ApiError(400, "Channel Id is required!");
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    throw new ApiError(400, "Invalid Channel Id format");
  }

  if (channelId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to yourself");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscription = await Subcription.findOneAndDelete({
    subscriber: req.user._id,
    channel: channelId,
  });

  let data;
  let message;
  if (subscription) {
    //existed now  it is unsubscribed
    data = { subscribed: false };
    message = "Unsubscribed successfully !";
  } else {
    //not existed, now subscribe it
    await Subcription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
    data = { subscribed: true };
    message = "Subscribed successfully !";
  }

  return res.status(200).json(new ApiResponse(200, data, message));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  
  const channelId = req.user._id;

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscriber: {
          $first: "$subscriber",
        },
      },
    },
    {
      $group: {
        _id: "$channel",
        subcribers: { $push: "$subscriber" },
        count: { $sum: 1 },
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribers[0], "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  
  const subscriberId = req.user._id;

  const channels = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channel",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        channel: {
          $first: "$channel",
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "channel._id",
        foreignField: "owner",
        as: "videos",
        pipeline: [
          {
            $sort: {
              createdAt: -1,
            },
          },
          { $limit: 1 },
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              createdAt: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        subscribedChannel: {
          $mergeObjects: [
            "$channel",
            {
              latestVideo: {
                $first: "$videos",
              },
            },
          ],
        },
      },
    },
    {
      $project: {
        subscribedChannel: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, channels, "Channels fetched successfully"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
