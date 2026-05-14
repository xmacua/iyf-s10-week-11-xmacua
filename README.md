# Week 11: CommunityHub API

## Author
- **Name:** Vivian macua
- **GitHub:** [@xmacua](https://github.com/xmacua)
- **Date:** May 14, 2026

## Project Description
A RESTful API with MongoDB persistence and JWT authentication for a community platform. Users can register, authenticate, create posts, add comments, and like content. Features include password hashing with bcrypt, protected routes using JWT tokens, and role-based authorization.

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose ODM
- JWT (JSON Web Tokens)
- bcryptjs
- dotenv

## Features
- User registration and login with JWT authentication
- Password hashing with bcrypt for secure storage
- Protected routes requiring authentication
- Create, read, update, delete posts with authorization
- Comment system on posts
- Post liking functionality
- User profile management
- Role-based access control (user/admin)
- Pagination, search, and sorting for posts
- Text search indexing on posts

## How to Run
1. Clone this repository
2. Create `.env` file from `.env.example` and configure:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/community-hub
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev    # Development mode
   npm start      # Production mode
   ```

## Lessons Learned
- How to structure a Node.js/Express application with proper separation of concerns
- Implementing JWT-based authentication with middleware
- Password security using bcrypt hashing
- MongoDB schema design with Mongoose including validation and virtuals
- Building RESTful APIs with proper error handling
- Authorization patterns for protecting resources (only authors can edit/delete)

## Challenges Faced
- **MongoDB Atlas Connection**: Configuring the correct connection string and whitelisting IPs
- **Password Hashing**: Ensuring bcrypt middleware runs only on modified passwords
- **Authorization Logic**: Implementing proper ownership checks for posts and comments
- **JWT Token Handling**: Managing token expiration and validation errors gracefully

## Live Demo
API runs locally at `http://localhost:3000`

### API Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |
| GET | /api/posts | List all posts |
| POST | /api/posts | Create post (protected) |
| PUT | /api/posts/:id | Update post (author only) |
| DELETE | /api/posts/:id | Delete post (author only) |
| POST | /api/posts/:id/like | Like a post |
| POST | /api/posts/:id/comments | Add comment (protected) |
