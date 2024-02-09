const mongoose = require('mongoose');
const Comment = require('../Models/commentModel');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'userformsdataby12'; // Replace with your actual secret key

const postComment = async (req, res) => {
    const { postId } = req.params;
    const { comment } = req.body;
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ status: 'error', message: 'Authorization header missing' });
    }

    // Split the header to separate "Bearer" from the actual token
    const [bearer, token] = authorizationHeader.split(' ');
    console.log(token);
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ status: 'error', message: 'Invalid Authorization header format' });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            console.error('Error decoding token:', err.message);
            return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }

        // Ensure that decoded exists and contains the expected properties
        if (!decoded || !decoded.id) {
            console.error('Invalid token format. Decoded:', decoded);
            return res.status(401).json({ status: 'error', message: 'Invalid token format' });
        }
        // Decode contains the payload of the token, which includes the user ID
        const userId = decoded.id;

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
    });
};

module.exports = postComment;
