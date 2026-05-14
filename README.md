# CommunityHub API — Week 11

A RESTful API with MongoDB persistence and JWT authentication.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

Edit `.env`:
```
PORT=3000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/community-hub?retryWrites=true&w=majority
JWT_SECRET=pick-a-long-random-secret-string
JWT_EXPIRES_IN=7d
```

### 3. Get MongoDB URI (Atlas — free)
1. Go to https://mongodb.com/atlas and create a free account
2. Create a free cluster
3. Add a database user (Database Access tab)
4. Whitelist your IP (Network Access tab) — use 0.0.0.0/0 to allow all
5. Click "Connect" → "Connect your application" → copy the URI
6. Replace `<password>` in the URI with your database user's password

### 4. Start the server
```bash
# Development (auto-restarts)
npm run dev

# Production
npm start
```

---

## Project Structure

```
community-hub/
├── server.js                  # Entry point
├── .env                       # Your secrets (never commit this)
├── .env.example               # Template
└── src/
    ├── app.js                 # Express app & middleware
    ├── config/
    │   └── database.js        # MongoDB connection
    ├── models/
    │   ├── User.js            # User schema (bcrypt password hashing)
    │   ├── Post.js            # Post schema
    │   └── Comment.js         # Comment schema
    ├── controllers/
    │   ├── authController.js  # register, login, getMe, updateMe
    │   ├── postsController.js # CRUD + like + getPostsByUser
    │   └── commentsController.js
    ├── middleware/
    │   └── auth.js            # protect, optionalAuth, restrictTo
    └── routes/
        ├── auth.js
        ├── posts.js
        └── users.js
```

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, get token |
| GET | /api/auth/me | Yes | Get current user |
| PUT | /api/auth/me | Yes | Update profile |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/posts | No | List all posts |
| GET | /api/posts/:id | No | Get one post |
| POST | /api/posts | Yes | Create post |
| PUT | /api/posts/:id | Yes (author) | Edit post |
| DELETE | /api/posts/:id | Yes (author) | Delete post |
| DELETE | /api/posts/:id/force | Yes (admin) | Force delete |
| POST | /api/posts/:id/like | No | Like a post |

Query params for GET /api/posts:
- `?search=keyword` — full-text search
- `?sort=oldest` or `?sort=popular`
- `?page=1&limit=10` — pagination

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/posts/:postId/comments | No | Get comments |
| POST | /api/posts/:postId/comments | Yes | Add comment |
| DELETE | /api/posts/:postId/comments/:commentId | Yes (author) | Delete comment |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/users/:id/posts | No | Get user's posts |

---

## Example Requests

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"secret123"}'
```

### Login (save the token!)
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

### Create a post (use token from login)
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My First Post","content":"Hello CommunityHub!","tags":["intro"]}'
```

### Add a comment
```bash
curl -X POST http://localhost:3000/api/posts/POST_ID/comments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"content":"Great post!"}'
```
