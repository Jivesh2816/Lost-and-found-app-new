# Vercel Deployment Guide

## Overview
This guide will help you deploy both your frontend and backend to Vercel.

## Prerequisites
- Vercel account
- MongoDB Atlas account (for production database)
- Git repository with your code

## Step 1: Environment Variables Setup

### For Backend (Vercel Environment Variables)
Set these in your Vercel project dashboard under Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/lost-and-found?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production
FRONTEND_URL=https://your-app-name.vercel.app
```

### For Frontend (Vercel Environment Variables)
```
REACT_APP_API_URL=https://your-app-name.vercel.app
```

## Step 2: Deploy to Vercel

1. **Connect your repository to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

2. **Configure build settings:**
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: `cd frontend && npm run build`
   - **Output Directory**: `frontend/build`
   - **Install Command**: `npm install && cd frontend && npm install`

3. **Deploy:**
   - Click "Deploy"
   - Wait for deployment to complete

## Step 3: Test Your Deployment

After deployment, test these endpoints:

- **Frontend**: `https://your-app-name.vercel.app`
- **Backend Health**: `https://your-app-name.vercel.app/health`
- **API Test**: `https://your-app-name.vercel.app/api/test`
- **Auth Endpoint**: `https://your-app-name.vercel.app/api/auth/login`

## Step 4: Update Frontend API Calls (Optional)

If you want to use the new API configuration file, update your components:

```javascript
// Instead of:
const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/login`, {

// Use:
import { API_ENDPOINTS } from '../config/api';
const res = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
```

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` is set correctly in Vercel environment variables
2. **Database Connection**: Verify your MongoDB Atlas connection string
3. **Build Failures**: Check that all dependencies are in package.json
4. **API Not Found**: Ensure vercel.json routes are configured correctly

### Debug Steps:

1. Check Vercel function logs in the dashboard
2. Test API endpoints directly using curl or Postman
3. Verify environment variables are set correctly
4. Check MongoDB Atlas connection and database permissions

## File Structure After Deployment

```
your-app/
├── frontend/          # React frontend
├── server.js         # Express backend
├── routes/           # API routes
├── models/           # Database models
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── vercel.json       # Vercel configuration
└── package.json      # Dependencies
```

## Benefits of Vercel Deployment

- ✅ Single platform for frontend and backend
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions (auto-scaling)
- ✅ Easy environment variable management
- ✅ Automatic deployments from Git
- ✅ Built-in analytics and monitoring
