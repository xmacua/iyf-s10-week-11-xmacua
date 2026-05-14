// src/routes/users.js
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// GET /api/users/:id/posts — get all posts by a specific user
router.get('/:id/posts', postsController.getPostsByUser);

module.exports = router;
