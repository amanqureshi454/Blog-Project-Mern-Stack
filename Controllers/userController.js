
const express = require("express");
const app = express()
const mongoose = require('mongoose');
const User = require('../Models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const SECRET_KEY = "userformsdataby12"
const cookie = require("cookie-parser")


app.use(cookie())

const user = async (req, res) => {


    // REGISTRATION LOGIC 


    // 1 // Check if the user already exists
    // if the user is exists then send response 


    // 2 Hash the password
    // if the user is not there in db then hash password 


    // 3 Create a new user using the Signup model
    //  then give the token to user by email or his id 

    // 4 Redirect to "/" after successfully creating the user

    const { username, email, password, confirmpassword } = req.body;

    try {

        const user = await User.findOne({ email });


        if (user) {
            return res.status(400).json({
                status: "fail",
                message: 'user already exists'

            })
        }

        if (!user) {
            const hashPassword = await bcrypt.hash(password, 12)

            const newUser = await User.create({
                username, email, password: hashPassword
            })
            // confirmpassword = undefined
            const token = jwt.sign({ id: newUser._id }, SECRET_KEY)

            return res.status(200).json({
                status: "success",
                message: 'user has been created',
                data: newUser,
                token
            })
        }
    } catch (err) {
        console.log(err)

    }
}
const login = async (req, res) => {

    /// L0GIN FORM LOGIC 

    // 1 step : take email,password from body
    //2 step: check if the user exists in signup model 
    // 3 step: if not then send response according to that 
    // 4 step : matchpassword and compare with bycrpty password store in db ,
    // 5 step : then give the token to user from his email, or id ,
    // 6 step : password is not match then send response 
    // 7 step : if the user exists and everything is ok then send response 

    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: 'login fail'
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        // confirmpassword = undefined
        const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY)
        // console.log(token);
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
            // You may include additional data or a token here based on your authentication strategy.
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