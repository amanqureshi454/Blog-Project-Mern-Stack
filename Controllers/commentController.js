const mongoose = require('mongoose');
const Comment = require('../Models/commentModel');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'userformsdataby12'; // Replace with your actual secret key

const postComment = async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    const userId = req.userId;

    try {
        const newComment = await Comment.create({
            content: comment,
            user: userId, // Use 'user' instead of 'userId'
            post: postId,
        });

        return res.status(200).json({
            status: 'success',
            message: `Comment on Post ${postId} and user is ${userId}`,
            data: newComment,
        })
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = postComment;
