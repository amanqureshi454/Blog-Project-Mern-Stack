const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
const createPostModel = require('../Models/createPostModel');

const editPost = async (req, res) => {
    const { id } = req.params;
    const { title, summary, description } = req.body;
    let file = req.file;

    try {
        if (!id || !title || !summary || !description) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedFields = { title, summary, description };
        if (file) {
            updatedFields.file = file.path; // Assuming Multer saves file path in req.file.path
        }

        const updatedPost = await createPostModel.findByIdAndUpdate(
            id,
            updatedFields,
            { new: true }
        );

        // console.log(updatedPost);
        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = editPost;
