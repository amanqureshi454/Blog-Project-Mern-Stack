const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('../Models/userModel'); // Make sure to provide the correct path to your User model

const SECRET_KEY = "userformsdataby12";

// Use the cookie-parser middleware
app.use(cookieParser());

const getUser = async (req, res) => {
    try {
        // Retrieve the Authorization header from the request
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


            // Find the user by ID
            try {
                const user = await User.findById(userId);

                if (!user) {
                    return res.status(404).json({ status: 'error', message: 'User not found' });
                }

                res.status(200).json({
                    status: 'success',
                    data: {
                        id: user._id,
                        name: user.username,
                        email: user.email,
                        bio: user.bio,
                        profileImage: user.profileImgURL,
                        createdAt: user.createdAt
                    },
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
                res.status(500).json({ status: 'error', message: 'Internal Server Error' });
            }
        });

    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};


module.exports = getUser;
