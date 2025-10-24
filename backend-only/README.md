# Lost and Found App - Backend API

This is the backend API for the Lost and Found application, deployed on Vercel.

## API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health check
- `GET /api/test` - Test endpoint
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/post` - Get all posts
- `POST /api/post` - Create new post
- `GET /api/post/user` - Get user's posts
- `DELETE /api/post/:id` - Delete post
- `POST /api/contact` - Send contact request

## Environment Variables

Set these in your Vercel dashboard:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to "production"
- `FRONTEND_URL` - Your frontend URL (e.g., https://your-frontend.vercel.app)

## Deployment

This backend is configured to deploy on Vercel using serverless functions.
