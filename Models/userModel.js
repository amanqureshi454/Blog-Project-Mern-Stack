const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    confirmpassword: String,
    profileImgURL: {
        type: String,
        default: 'https://cdn.australianageingagenda.com.au/wp-content/uploads/2015/06/28085920/Phil-Beckett-2-e1435107243361.jpg',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    bio: {
        type: String,
        default: "",
    },
    // account_info: {
    //     total_posts: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         default: 0,
    //         ref: "Post"
    //     },
    //     total_reads: {
    //         type: Number,
    //         default: 0
    //     },

},
    {
        timestamps: true
    })
const User = mongoose.model('User', UserSchema);
module.exports = User;