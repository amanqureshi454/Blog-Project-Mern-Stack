const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const User = require('../Models/userModel'); // Make sure to provide the correct path to your User model



// Use the cookie-parser middleware
app.use(cookieParser());

const getUser = async (req, res) => {
    try {
        const userId = req.userId;
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


    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};


module.exports = getUser;
