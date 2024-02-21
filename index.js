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
const updateProfile = require('./Controllers/updateProfileController');
const editPost = require('./Controllers/editPostController');
const tokenAuthMiddleware = require('./Controllers/auth');


app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(__dirname + '/uploads'));


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
// mongodb+srv://qureshiamanqureshi:mongodbamanatlas@cluster0.6day8ss.mongodb.net/blog

mongoose
    .connect(process.env.MONGODB_URL, {
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
app.get('/', (req, res) => {
    res.send('Backend is Running')
})
app.get('/getUser', tokenAuthMiddleware, getUser)
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
app.get('/getPostbyUserId', tokenAuthMiddleware, async (req, res) => {

    const userId = req.userId;
    console.log(userId, "get postby id ");

    try {
        const postByUser = await createPostModel.find({ author: userId }).populate({ path: 'author', select: 'username profileImgURL' }).sort({ createdAt: -1 });
        res.json({ postByUserId: postByUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching Post by UserId' });
    }
});

app.get('/getComment', tokenAuthMiddleware, async (req, res) => {
    const userId = req.userId;
    console.log(userId, "get comment ");
    try {
        const allComment = await Comment.find({ user: userId }).populate({ path: 'user', select: 'username profileImgURL' }).sort({ createdAt: -1 });
        res.json({ comments: allComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching comments' });
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

app.post('/postComment/:postId', tokenAuthMiddleware, postComment)
app.post('/register', user)
app.post('/login', login)
app.post('/createpost', upload.single('file'), tokenAuthMiddleware, createPost);
app.put('/profileUpdate', upload.single('profileImage'), tokenAuthMiddleware, updateProfile);
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

const port = process.env.PORT;
app.listen((port), () => {
    console.log(`Server is Running On Port ${port}`);
})
// "bcryptjs": "^2.4.3",
//     "cookie-parser": "^1.4.6",
//     "cors": "^2.8.5",
//     "dotenv": "^16.4.1",
//     "express": "^4.18.2",
//     "jsonwebtoken": "^9.0.2",
//     "mongoose": "^8.1.1",
//     "multer": "^1.4.5-lts.1",
//     "path": "^0.12.7"
//   }