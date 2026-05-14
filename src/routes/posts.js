// src/routes/posts.js
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const commentsController = require('../controllers/commentsController');
const { protect, restrictTo } = require('../middleware/auth');

// Public
router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/:id/like', postsController.likePost);

// Protected
router.post('/', protect, postsController.createPost);
router.put('/:id', protect, postsController.updatePost);
router.delete('/:id', protect, postsController.deletePost);

// Admin only
router.delete('/:id/force', protect, restrictTo('admin'), postsController.forceDelete);

// Comments
router.get('/:postId/comments', commentsController.getComments);
router.post('/:postId/comments', protect, commentsController.createComment);
router.delete('/:postId/comments/:commentId', protect, commentsController.deleteComment);

module.exports = router;
