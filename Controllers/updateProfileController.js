const mongoose = require('mongoose');
const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_KEY = 'userformsdataby12'; // Replace with your actual secret key


const updateProfile = async (req, res) => {
    try {
        const file = req.file;
        const { username, bio, newPassword, confirmPassword } = req.body;
        console.log(username, bio);
        const authorizationHeader = req.headers.authorization;

        // Add validation logic here if needed

        if (!authorizationHeader) {
            return res.status(401).json({ status: 'error', message: 'Authorization header missing' });
        }

        const [bearer, token] = authorizationHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
            return res.status(401).json({ status: 'error', message: 'Invalid Authorization header format' });
        }

        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.error('Error decoding token:', err.message);
                return res.status(401).json({ status: 'error', message: 'Invalid token' });
            }

            if (!decoded || !decoded.id) {
                console.error('Invalid token format. Decoded:', decoded);
                return res.status(401).json({ status: 'error', message: 'Invalid token format' });
            }

            const userId = decoded.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'User not found' });
            }

            if (file) {
                // Handle file upload and update user's profile image URL
                const profileImgURL = 'http://localhost:4000/uploads/' + file.filename; // Replace with actual URL or path
                user.profileImgURL = profileImgURL;
            }

            // Update other fields
            // Update other fields
            if (username !== undefined) user.username = username || user.username;
            if (bio !== undefined) user.bio = bio || user.bio;
            if (newPassword !== undefined) {
                // Hash the new password
                const hashPassword = await bcrypt.hash(newPassword, 12);
                user.password = hashPassword;
            }


            const updatedUser = await user.save();
            console.log(updatedUser);

            res.status(200).json({ status: 'success', data: updatedUser });
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update profile' });
    }
};




module.exports = updateProfile