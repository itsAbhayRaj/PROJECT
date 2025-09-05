# TubeClone API

A comprehensive YouTube clone backend API built with Node.js, Express, and MongoDB. This API provides all the essential features for a video-sharing platform including user management, video uploads, comments, likes, playlists, subscriptions, and more.

##  Features

- **User Management**: Registration, authentication, profile management
- **Video Management**: Upload, update, delete, and publish videos
- **Comments System**: Add, update, delete comments on videos
- **Like System**: Like/unlike videos, comments, and tweets
- **Playlist Management**: Create and manage video playlists
- **Subscription System**: Subscribe/unsubscribe to channels
- **Tweet System**: Create and manage tweets
- **Dashboard**: Channel statistics and analytics
- **File Upload**: Support for video and image uploads via Cloudinary
- **JWT Authentication**: Secure token-based authentication
- **CORS Support**: Cross-origin resource sharing enabled

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Security**: bcrypt for password hashing
- **CORS**: Cross-Origin Resource Sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for file uploads)
- Git

##  Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd PROJECT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3000

# Database
MONGODB_URI=mongodb://localhost:27017

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# JWT Secret (generate a strong secret)
JWT_SECRET=your_jwt_secret_here

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

##  API Endpoints

### Health Check
- `GET /healthCheck` - Check API status

### User Management
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `POST /users/logout` - Logout user (protected)
- `POST /users/refresh-token` - Refresh access token
- `GET /users/current-user` - Get current user (protected)
- `PATCH /users/update-account` - Update account (protected)
- `POST /users/change-password` - Change password (protected)
- `PATCH /users/avatar` - Update avatar (protected)
- `PATCH /users/coverImage` - Update cover image (protected)
- `GET /users/c/:username` - Get channel profile (protected)
- `GET /users/history` - Get watch history (protected)

### Video Management
- `GET /videos` - Get all videos
- `GET /videos/:videoId` - Get video by ID
- `POST /videos` - Upload video (protected)
- `PATCH /videos/:videoId` - Update video (protected)
- `DELETE /videos/:videoId` - Delete video (protected)
- `PATCH /videos/:videoId/toggle-status` - Toggle publish status (protected)

### Comments
- `POST /comments/:videoId` - Add comment (protected)
- `GET /comments/:videoId` - Get video comments (protected)
- `PATCH /comments/:commentId` - Update comment (protected)
- `DELETE /comments/:commentId` - Delete comment (protected)

### Likes
- `POST /likes/video/:videoId` - Toggle video like (protected)
- `POST /likes/comment/:commentId` - Toggle comment like (protected)
- `POST /likes/tweet/:tweetId` - Toggle tweet like (protected)
- `GET /likes/videos` - Get liked videos (protected)

### Playlists
- `POST /playlist` - Create playlist (protected)
- `GET /playlist/user/:userId` - Get user playlists (protected)
- `GET /playlist/:playlistId` - Get playlist by ID (protected)
- `PATCH /playlist/:playlistId` - Update playlist (protected)
- `DELETE /playlist/:playlistId` - Delete playlist (protected)
- `POST /playlist/:playlistId/video/:videoId` - Add video to playlist (protected)
- `DELETE /playlist/:playlistId/video/:videoId` - Remove video from playlist (protected)

### Subscriptions
- `POST /subscriptions/:channelId` - Subscribe to channel (protected)
- `DELETE /subscriptions/:channelId` - Unsubscribe from channel (protected)
- `GET /subscriptions` - Get user subscriptions (protected)

### Tweets
- `POST /tweets` - Create tweet (protected)
- `GET /tweets` - Get tweets (protected)
- `PATCH /tweets/:tweetId` - Update tweet (protected)
- `DELETE /tweets/:tweetId` - Delete tweet (protected)

### Dashboard
- `GET /dashboard/stats` - Get channel statistics (protected)
- `GET /dashboard/videos` - Get channel videos (protected)

## 🧪 Testing the API

### Using Postman/Thunder Client

1. **Health Check**
   ```
   GET http://localhost:3000/api/v1/healthCheck
   ```

2. **Register User**
   ```
   POST http://localhost:3000/api/v1/users/register
   Content-Type: application/json
   
   {
     "username": "testuser",
     "email": "test@example.com",
     "fullName": "Test User",
     "password": "password123"
   }
   ```

3. **Login**
   ```
   POST http://localhost:3000/api/v1/users/login
   Content-Type: application/json
   
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

4. **Use JWT token for protected routes**
   ```
   Authorization: Bearer YOUR_JWT_TOKEN_HERE
   ```

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/v1/healthCheck

# Register user
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","fullName":"Test User","password":"password123"}'
```

## 🌐 Deployment

### Railway (Recommended)

1. Push your code to GitHub
2. Connect your GitHub account to [Railway](https://railway.app)
3. Create a new project from your repository
4. Set up environment variables in Railway dashboard
5. Deploy!

### Environment Variables for Production

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=https://your-frontend-domain.com
JWT_SECRET=your_production_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 📁 Project Structure

```
src/
├── controllers/     # Route controllers
├── middlewares/     # Custom middlewares
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
├── db/            # Database connection
├── app.js         # Express app configuration
└── index.js       # Server entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## ‍💻 Author

**Abhay** - [Your GitHub Profile]

## 🆘 Support

If you have any questions or need help, please open an issue in the repository.

---

**Happy Coding! 🚀**
```

This comprehensive README includes:

1. **Project overview** with features and tech stack
2. **Setup instructions** with environment variables
3. **Complete API documentation** with all endpoints
4. **Testing examples** for Postman and cURL
5. **Deployment instructions** for Railway
6. **Project structure** overview
7. **Contributing guidelines**

The README is now ready for your TubeClone API and provides everything someone needs to understand, set up, and use your API!