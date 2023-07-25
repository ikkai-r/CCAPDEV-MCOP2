const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    // user connected to Account
    username: {
        type: mongoose.Schema.Types.ObjectId, ref:'Account'
    },
    post_commented: {
        type: mongoose.Schema.Types.ObjectId, ref:'Post'
    },
    comment_content: {
        type: String,
        required: true,
        min: 1,
    },
    comment_date: {
        type: String
    },
    is_edited: {
        type: Boolean,
        default: false
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId, ref:'Comment',
    }],
    parent_comment_id: {
        type: mongoose.Schema.Types.ObjectId, ref:'Comment'
    },
})

module.exports = mongoose.model('Comment', commentSchema);