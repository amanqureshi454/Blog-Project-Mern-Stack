const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    summary: String,
    description: String,
    file: String,

    author: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Replace this with the correct reference to your User model
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
    }
},
    {
        timestamps: true
    });

const createPost = mongoose.model('Post', postSchema);

module.exports = createPost;
