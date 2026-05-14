// src/models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [3, 'Title must be at least 3 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [10, 'Content must be at least 10 characters']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    published: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});

// Text index for search
postSchema.index({ title: 'text', content: 'text' });

// Virtual: get comments for this post
postSchema.virtual('commentList', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post'
});

// Instance method: like a post
postSchema.methods.like = function () {
    this.likes++;
    return this.save();
};

// Static method: find by author username
postSchema.statics.findByAuthor = function (author) {
    return this.find({ author: new RegExp(author, 'i') });
};

module.exports = mongoose.model('Post', postSchema);
