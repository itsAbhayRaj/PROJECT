# TubeClone API Documentation

## Base URL
```
https://your-app-name.railway.app/api/v1
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Response Format
All API responses follow this standard format:
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Success message",
  "success": true
}
```

---

## 1. Health Check

### GET /healthCheck
Check API status and system health.

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "status": "OK",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": "1h 30m 45s",
    "database": {
      "status": "connected",
      "name": "youtube"
    },
    "system": {
      "platform": "win32",
      "nodeVersion": "v18.17.0",
      "memory": {
        "rss": "45 MB",
        "heapTotal": "20 MB",
        "heapUsed": "15 MB",
        "external": "5 MB"
      }
    }
  },
  "message": "Health check completed successfully!",
  "success": true
}
```

---

## 2. User Management

### POST /users/register
Register a new user.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "password": "password123"
}
```

**Files (multipart/form-data):**
- `avatar` (required): Image file
- `coverImage` (optional): Image file

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://res.cloudinary.com/...",
    "coverImage": "https://res.cloudinary.com/...",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User Registered Successfully",
  "success": true
}
```

### POST /users/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://res.cloudinary.com/...",
      "coverImage": "https://res.cloudinary.com/..."
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged In Successfully",
  "success": true
}
```

### POST /users/logout
Logout user (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "User Logged Out Successfully",
  "success": true
}
```

### POST /users/refresh-token
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Access Token Refreshed Successfully",
  "success": true
}
```

### GET /users/current-user
Get current user details (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://res.cloudinary.com/...",
    "coverImage": "https://res.cloudinary.com/..."
  },
  "message": "Current User Fetched",
  "success": true
}
```

### PATCH /users/update-account
Update account details (requires JWT token).

**Request Body:**
```json
{
  "fullName": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "email": "johnsmith@example.com",
    "fullName": "John Smith",
    "avatar": "https://res.cloudinary.com/...",
    "coverImage": "https://res.cloudinary.com/..."
  },
  "message": "Account Details Updated",
  "success": true
}
```

### POST /users/change-password
Change password (requires JWT token).

**Request Body:**
```json
{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": null,
  "message": "New Password Updated",
  "success": true
}
```

### PATCH /users/avatar
Update avatar (requires JWT token).

**Files (multipart/form-data):**
- `avatar` (required): Image file

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://res.cloudinary.com/new-avatar-url",
    "coverImage": "https://res.cloudinary.com/..."
  },
  "message": "Avatar File Updated!",
  "success": true
}
```

### PATCH /users/coverImage
Update cover image (requires JWT token).

**Files (multipart/form-data):**
- `coverImage` (required): Image file

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://res.cloudinary.com/...",
    "coverImage": "https://res.cloudinary.com/new-cover-url"
  },
  "message": "Cover Image Updated!",
  "success": true
}
```

### GET /users/c/:username
Get user channel profile (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "fullName": "John Doe",
    "username": "johndoe",
    "subscribersCount": 150,
    "subscribedToCount": 25,
    "isSubscribed": false,
    "avatar": "https://res.cloudinary.com/...",
    "coverImage": "https://res.cloudinary.com/..."
  },
  "message": "User Channel Fetched Successfully!",
  "success": true
}
```

### GET /users/history
Get user watch history (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Sample Video",
      "description": "Video description",
      "videoFile": "https://res.cloudinary.com/...",
      "thumbnail": "https://res.cloudinary.com/...",
      "duration": 120,
      "views": 1000,
      "isPublished": true,
      "owner": {
        "username": "videocreator",
        "avatar": "https://res.cloudinary.com/..."
      }
    }
  ],
  "message": "Watch History Fetched Successfully",
  "success": true
}
```

---

## 3. Video Management

### GET /videos
Get all published videos with pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `query` (optional): Search query for title/description
- `sortBy` (optional): Sort field (e.g., "createdAt", "views")
- `sortType` (optional): Sort direction ("asc" or "desc")
- `userId` (optional): Filter by user ID

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "docs": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "title": "Sample Video",
        "description": "Video description",
        "videoFile": "https://res.cloudinary.com/...",
        "thumbnail": "https://res.cloudinary.com/...",
        "duration": 120,
        "views": 1000,
        "isPublished": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "owner": {
          "fullName": "John Doe",
          "username": "johndoe",
          "avatar": "https://res.cloudinary.com/..."
        }
      }
    ],
    "hasNextPage": true,
    "totalPages": 5,
    "currentPage": 1,
    "totalVideos": 50
  },
  "message": "Videos fetched successfully",
  "success": true
}
```

### GET /videos/:videoId
Get video by ID.

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Sample Video",
    "description": "Video description",
    "videoFile": "https://res.cloudinary.com/...",
    "thumbnail": "https://res.cloudinary.com/...",
    "duration": 120,
    "views": 1001,
    "isPublished": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "owner": {
      "fullName": "John Doe",
      "username": "johndoe",
      "avatar": "https://res.cloudinary.com/..."
    },
    "isLiked": false
  },
  "message": "Video fetched successfully",
  "success": true
}
```

### POST /videos
Upload new video (requires JWT token).

**Files (multipart/form-data):**
- `videoFile` (required): Video file
- `thumbnail` (required): Thumbnail image

**Request Body:**
```json
{
  "title": "My New Video",
  "description": "This is my new video description"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "My New Video",
    "description": "This is my new video description",
    "videoFile": "https://res.cloudinary.com/...",
    "thumbnail": "https://res.cloudinary.com/...",
    "duration": 120,
    "views": 0,
    "isPublished": false,
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Video created successfully",
  "success": true
}
```

### PATCH /videos/:videoId
Update video (requires JWT token).

**Request Body:**
```json
{
  "title": "Updated Video Title",
  "description": "Updated video description"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Updated Video Title",
    "description": "Updated video description",
    "videoFile": "https://res.cloudinary.com/...",
    "thumbnail": "https://res.cloudinary.com/...",
    "duration": 120,
    "views": 1000,
    "isPublished": true
  },
  "message": "Video updated successfully",
  "success": true
}
```

### DELETE /videos/:videoId
Delete video (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Video deleted successfully",
  "success": true
}
```

### PATCH /videos/:videoId/toggle-status
Toggle video publish status (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Sample Video",
    "description": "Video description",
    "isPublished": false
  },
  "message": "Video status toggled successfully",
  "success": true
}
```

---

## 4. Comments

### POST /comments/:videoId
Add comment to video (requires JWT token).

**Request Body:**
```json
{
  "content": "This is a great video!"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "content": "This is a great video!",
    "video": "60f7b3b3b3b3b3b3b3b3b3b3",
    "owner": {
      "fullName": "John Doe",
      "username": "johndoe",
      "avatar": "https://res.cloudinary.com/..."
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Comment added successfully",
  "success": true
}
```

### GET /comments/:videoId
Get comments for video (requires JWT token).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "content": "This is a great video!",
      "video": "60f7b3b3b3b3b3b3b3b3b3b3",
      "owner": {
        "fullName": "John Doe",
        "username": "johndoe",
        "avatar": "https://res.cloudinary.com/..."
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Comments fetched successfully",
  "success": true
}
```

### PATCH /comments/:commentId
Update comment (requires JWT token).

**Request Body:**
```json
{
  "content": "Updated comment content"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "content": "Updated comment content",
    "video": "60f7b3b3b3b3b3b3b3b3b3b3",
    "owner": {
      "fullName": "John Doe",
      "username": "johndoe",
      "avatar": "https://res.cloudinary.com/..."
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Comment updated successfully",
  "success": true
}
```

### DELETE /comments/:commentId
Delete comment (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Comment deleted successfully",
  "success": true
}
```

---

## 5. Likes

### POST /likes/video/:videoId
Toggle video like (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "liked": true
  },
  "message": "Video liked successfully",
  "success": true
}
```

### POST /likes/comment/:commentId
Toggle comment like (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "liked": false
  },
  "message": "Comment disliked successfully",
  "success": true
}
```

### POST /likes/tweet/:tweetId
Toggle tweet like (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "liked": true
  },
  "message": "Tweet liked successfully",
  "success": true
}
```

### GET /likes/videos
Get liked videos (requires JWT token).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "video": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "title": "Sample Video",
        "description": "Video description",
        "videoFile": "https://res.cloudinary.com/...",
        "thumbnail": "https://res.cloudinary.com/...",
        "duration": 120,
        "views": 1000,
        "isPublished": true,
        "owner": {
          "username": "videocreator",
          "fullName": "Video Creator",
          "avatar": "https://res.cloudinary.com/..."
        }
      }
    }
  ],
  "message": "Liked videos fetched successfully !",
  "success": true
}
```

---

## 6. Playlists

### POST /playlist
Create playlist (requires JWT token).

**Request Body:**
```json
{
  "name": "My Favorites",
  "description": "My favorite videos"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "My Favorites",
    "description": "My favorite videos",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Playlist created successfully",
  "success": true
}
```

### GET /playlist/user/:userId
Get user playlists (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "My Favorites",
      "description": "My favorite videos",
      "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Playlists fetched successfully",
  "success": true
}
```

### GET /playlist/:playlistId
Get playlist by ID (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "My Favorites",
    "description": "My favorite videos",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "videos": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "title": "Sample Video",
        "description": "Video description",
        "videoFile": "https://res.cloudinary.com/...",
        "thumbnail": "https://res.cloudinary.com/..."
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Playlist fetched successfully",
  "success": true
}
```

### PATCH /playlist/:playlistId
Update playlist (requires JWT token).

**Request Body:**
```json
{
  "name": "Updated Playlist Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "Updated Playlist Name",
    "description": "Updated description",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3"
  },
  "message": "Playlist updated successfully",
  "success": true
}
```

### DELETE /playlist/:playlistId
Delete playlist (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Playlist deleted successfully",
  "success": true
}
```

### POST /playlist/:playlistId/video/:videoId
Add video to playlist (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "message": "Video added to playlist successfully"
  },
  "message": "Video added to playlist successfully",
  "success": true
}
```

### DELETE /playlist/:playlistId/video/:videoId
Remove video from playlist (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "message": "Video removed from playlist successfully"
  },
  "message": "Video removed from playlist successfully",
  "success": true
}
```

---

## 7. Subscriptions

### POST /subscriptions/:channelId
Subscribe to channel (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "message": "Subscribed to channel successfully"
  },
  "message": "Subscribed to channel successfully",
  "success": true
}
```

### DELETE /subscriptions/:channelId
Unsubscribe from channel (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "message": "Unsubscribed from channel successfully"
  },
  "message": "Unsubscribed from channel successfully",
  "success": true
}
```

### GET /subscriptions
Get user subscriptions (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "channel": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "channelowner",
        "fullName": "Channel Owner",
        "avatar": "https://res.cloudinary.com/..."
      },
      "subscriber": "60f7b3b3b3b3b3b3b3b3b3b3",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Subscriptions fetched successfully",
  "success": true
}
```

---

## 8. Tweets

### POST /tweets
Create tweet (requires JWT token).

**Request Body:**
```json
{
  "content": "This is my first tweet!"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "content": "This is my first tweet!",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tweet created successfully",
  "success": true
}
```

### GET /tweets
Get tweets (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "content": "This is my first tweet!",
      "owner": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "username": "johndoe",
        "fullName": "John Doe",
        "avatar": "https://res.cloudinary.com/..."
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Tweets fetched successfully",
  "success": true
}
```

### PATCH /tweets/:tweetId
Update tweet (requires JWT token).

**Request Body:**
```json
{
  "content": "Updated tweet content"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "content": "Updated tweet content",
    "owner": "60f7b3b3b3b3b3b3b3b3b3b3",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tweet updated successfully",
  "success": true
}
```

### DELETE /tweets/:tweetId
Delete tweet (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {},
  "message": "Tweet deleted successfully",
  "success": true
}
```

---

## 9. Dashboard

### GET /dashboard/stats
Get channel statistics (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "totalVideos": 25,
    "totalViews": 15000,
    "totalSubscribers": 500,
    "totalLikes": 2500
  },
  "message": "Channel statistics fetched successfully",
  "success": true
}
```

### GET /dashboard/videos
Get channel videos (requires JWT token).

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "My Video",
      "description": "Video description",
      "videoFile": "https://res.cloudinary.com/...",
      "thumbnail": "https://res.cloudinary.com/...",
      "views": 1000,
      "isPublished": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Channel videos fetched successfully",
  "success": true
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "data": null,
  "message": "All fields are required",
  "success": false
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized request",
  "success": false
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "data": null,
  "message": "You can only update your own comments",
  "success": false
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "data": null,
  "message": "Video not found",
  "success": false
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "data": null,
  "message": "User with email or username already exists!!",
  "success": false
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "data": null,
  "message": "Internal server error",
  "success": false
}
```

---

## Rate Limiting
- No rate limiting is currently implemented
- Consider implementing rate limiting for production use

## CORS
- CORS is enabled for the configured origin
- Update `CORS_ORIGIN` environment variable for your frontend domain

## File Upload Limits
- Video files: No specific limit (handled by Cloudinary)
- Image files: No specific limit (handled by Cloudinary)
- Consider implementing file size limits for production use

---

This documentation covers all the available endpoints in your TubeClone API. Each endpoint includes request/response examples and error handling information.
