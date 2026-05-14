// src/controllers/postsController.js
const Post = require('../models/Post');

// GET /api/posts
const getAllPosts = async (req, res, next) => {
    try {
        const { author, search, sort, page = 1, limit = 10 } = req.query;

        let query = {};
        if (author) query['author'] = author; // filter by user ID
        if (search) query.$text = { $search: search };

        let sortOption = { createdAt: -1 }; // newest first
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'popular') sortOption = { likes: -1 };

        const skip = (page - 1) * limit;

        const posts = await Post.find(query)
            .populate('author', 'username')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Post.countDocuments(query);

        res.json({
            posts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/posts/:id
const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email')
            .populate('commentList');

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid post ID' });
        }
        next(error);
    }
};

// POST /api/posts  (protected)
const createPost = async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;

        const post = new Post({
            title,
            content,
            author: req.user._id,
            tags
        });

        await post.save();
        await post.populate('author', 'username email');

        res.status(201).json(post);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ errors: messages });
        }
        next(error);
    }
};

// PUT /api/posts/:id  (protected — author only)
const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only edit your own posts' });
        }

        const { title, content, tags } = req.body;
        if (title) post.title = title;
        if (content) post.content = content;
        if (tags) post.tags = tags;

        await post.save();
        await post.populate('author', 'username');

        res.json(post);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ errors: messages });
        }
        next(error);
    }
};

// DELETE /api/posts/:id  (protected — author only)
const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        await post.deleteOne();

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// DELETE /api/posts/:id/force  (admin only)
const forceDelete = async (req, res, next) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

// POST /api/posts/:id/like
const likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await post.like();
        res.json(post);
    } catch (error) {
        next(error);
    }
};

// GET /api/users/:id/posts
const getPostsByUser = async (req, res, next) => {
    try {
        const posts = await Post.find({ author: req.params.id })
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost, forceDelete, likePost, getPostsByUser };
