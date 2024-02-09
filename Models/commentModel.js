const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
      
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace this with a reference to a User model if you have one
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', // Assuming your Post model is named 'Post'
        required: true,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
