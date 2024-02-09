const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const multer = require('multer');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { user, login } = require('./Controllers/userController');
const createPost = require('./Controllers/createPostController')
const getUser = require('./Controllers/userProfileController');
const getAllPost = require('./Models/createPostModel');
const Comment = require('./Models/commentModel');
const createPostModel = require('./Models/createPostModel')
const postComment = require('./Controllers/commentController');
const SECRET_KEY = 'userformsdataby12'; // Replace with your actual secret key
const jwt = require('jsonwebtoken');
const updateProfile = require('./Controllers/updateProfileController');
const editPost = require('./Controllers/editPostController');
const path = require('path')


app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(__dirname + '/uploads'));

app.use(express.static(path.resolve(__dirname, 'frontend', 'dist')));

// Route for serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});



// multer configuration for imgs / files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination folder for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set a unique filename for each uploaded file
    },
});

const upload = multer({ storage: storage });

// db---connection
mongoose
    .connect("mongodb://localhost:27017/blog", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected With DB')
    })
    .catch(() => {
        console.log('DB Is Not Connected');
    });




// routes
app.get('/getUser', getUser)
app.get('/getAllPost', async (req, res) => {
    try {

        const allPost = await getAllPost.find().populate({ path: 'author', select: 'username profileImgURL' }).sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            data: allPost
        })
    }
    catch (err) {
        res.status(500).json({
            status: "fail to fetch post",

        })
        console.log(err, +"cant fetch all post")

    }

})
app.get('/getPost/:id', async (req, res) => {
    const { id } = req.params
    try {
        const postById = await getAllPost.findById(id).populate({ path: 'author', select: 'username profileImgURL' })
        if (!postById) {
            return res.status(404).json({
                status: "fail to fetch post",
                error: "Post not found"
            });
        }

        res.status(200).json({
            status: "success",
            data: postById
        });
    } catch (err) {
        res.status(500).json({
            status: "fail to fetch post",
            error: err.message
        });
        console.error("Error fetching specific post:", err);
    }

})
app.get('/getPostbyUserId', async (req, res) => {
    const authorizationHeader = req.headers.authorization;
    try {
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
                const postByUser = await createPostModel.find({ author: userId }).populate({ path: 'author', select: 'username profileImgURL' }).sort({ createdAt: -1 });
                res.json({ postByUserId: postByUser });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error fetching Post by UserId' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error handling request' });
    }
});
app.get('/getComment', async (req, res) => {
    const authorizationHeader = req.headers.authorization;
    try {
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
                const allComment = await Comment.find({ user: userId }).populate({ path: 'user', select: 'username profileImgURL' }).sort({ createdAt: -1 });
                res.json({ comments: allComment });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error fetching comments' });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error handling request' });
    }
});

app.get('/getComment/:postId', async (req, res) => {
    const { postId } = req.params;
    // console.log(postId);

    try {
        const allComment = await Comment.find({ post: postId }).populate({ path: 'user', select: 'username profileImgURL' }).sort({ createdAt: -1 });
        res.json({ comments: allComment });
        // res.send("hello")
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching comments' });
    }
});

app.post('/postComment/:postId', postComment)
app.post('/register', user)
app.post('/login', login)
app.post('/createpost', upload.single('file'), createPost);
app.put('/profileUpdate', upload.single('profileImage'), updateProfile);
app.put('/editPost/:id', upload.single('file'), editPost)
app.delete('/postDelete/:id', async (req, res) => {
    const postId = req.params.id;

    try {
        // Find the post by ID and delete it
        const deletedPost = await createPostModel.findByIdAndDelete(postId);

        if (!deletedPost) {
            // If the post with the provided ID is not found
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully', deletedPost });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Error deleting post' });
    }
})

const port = 4000;
app.listen((port), () => {
    console.log(`Server is Running On Port ${port}`);
})