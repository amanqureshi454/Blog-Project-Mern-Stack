const mongoose = require('mongoose');
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');



const updateProfile = async (req, res) => {
    try {
        const file = req.file;
        const { username, bio, newPassword, confirmPassword } = req.body;
        const userId = req.userId;
        console.log(userId, "Profile updated");


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
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ status: 'error', message: 'Failed to update profile' });
    }
}





module.exports = updateProfile