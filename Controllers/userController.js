const express = require("express");
const app = express()
const mongoose = require('mongoose');
const User = require('../Models/userModel');
const bcryptjs = require('bcryptjs'); // Use bcryptjs instead of bcrypt
const jwt = require('jsonwebtoken')
const cookie = require("cookie-parser")


app.use(cookie())

const user = async (req, res) => {

    const { username, email, password, confirmpassword } = req.body;

    try {

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                status: "fail",
                message: 'user already exists'
            })
        }

        const hashPassword = await bcryptjs.hash(password, 12); // Use bcryptjs.hash instead of bcrypt.hash

        const newUser = await User.create({
            username, email, password: hashPassword
        });

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY)

        return res.status(200).json({
            status: "success",
            message: 'user has been created',
            data: newUser,
            token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: 'error',
            message: 'Failed to create user',
            error: err,
        });
    }
}

const login = async (req, res) => {

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: 'login fail'
            })
        }

        const matchPassword = await bcryptjs.compare(password, user.password); // Use bcryptjs.compare instead of bcrypt.compare

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.SECRET_KEY)

        if (!matchPassword) {
            return res.status(401).json({
                status: 'fail',
                message: 'Wrong Password',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Welcome, ' + user.username,
            token: token
        });

    } catch (err) {
        return res.status(500).json({
            status: 'error',
            message: 'Failed to Login',
            error: err,
        });
    }
}

module.exports = { user, login };
