const mongoose = require('mongoose');
const createPostModel = require('../Models/createPostModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'userformsdataby12'; // Replace with your actual secret key
// Import jwt module

const createPost = async (req, res) => {
    const { title, summary, description } = req.body;
    const file = req.file;
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ status: 'error', message: 'Authorization header missing' });
    }

    // Split the header to separate "Bearer" from the actual token
    const [bearer, token] = authorizationHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
        return res.status(401).json({ status: 'error', message: 'Invalid Authorization header format' });
    }

    // Verify the token
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }

        // Decode contains the payload of the token, which may include the user ID
        const userId = decoded.id;
        // Handle the data as needed
        console.log("Title:", title);
        console.log("Summary:", summary);
        console.log("Description:", description);
        console.log("File:", file);

        try {
            // Create a new post using Mongoose model
            const newPost = new createPostModel({
                title,
                summary,
                file: file?.path,  // Assuming `file.path` is the correct path to the file
                description,
                author: userId
            });

            // Save the new post to the database
            const savedPost = await newPost.save();

            // Respond to the client with the saved post data
            res.json({
                status: 'success',
                message: 'Post created successfully',
                data: savedPost,
            });
        } catch (error) {
            console.error("Error while saving post:", error);
            res.status(500).json({
                status: 'error',
                message: 'Error while saving post',
            });
        }
    });
};

module.exports = createPost;
