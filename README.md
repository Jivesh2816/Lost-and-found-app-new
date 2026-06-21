# Lost & Found Platform

A full-stack web application that connects people who've lost items with those who've found them. Built with **Express.js**, **MongoDB**, **React**, and **Cloudinary** for image storage.

## Features

- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **Post Management**: Create, view, and search for lost/found items with images
- **Image Upload**: Upload item photos to Cloudinary for reliable storage and delivery
- **Contact System**: Direct messaging between users who've found and lost items
- **Real-time Search**: Find items by category, location, and description
- **User Profiles**: Track all your lost/found posts in one place

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary
- **Validation**: express-validator
- **Email**: Nodemailer

### Frontend
- **Framework**: React
- **Routing**: React Router v7
- **Styling**: CSS/Tailwind

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Cloudinary account

### Installation

1. Clone: `git clone https://github.com/Jivesh2816/Lost-and-found-app-new.git`
2. Install: `npm install && cd frontend && npm install`
3. Setup `.env` with MongoDB, Cloudinary, and Email credentials
4. Run: `npm run dev` (backend) and `npm start` (frontend)

Backend: http://localhost:5000  
Frontend: http://localhost:3000

## API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post (with image)
- `POST /api/contact` - Contact request

## Deployment

Configured for Vercel. See `VERCEL_DEPLOYMENT.md`

---

**Created by**: Jivesh Arora
