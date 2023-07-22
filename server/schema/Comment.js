const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // user connected to Account
    username: {
        type: mongoose.Schema.Types.ObjectId, ref:'Account'
    },
    comment_content: {
        type: String,
        required: true,
        min: 1,
    },
    // upvotes and downvotes are counted by account
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId, ref:'Account',
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId, ref:'Account',
    }],
    comment_date: {
        type: Date,
        default: () => Date.now(),
    },
    comment_date_modified: Date,
    replies: [mongoose.SchemaTypes.ObjectId]
})

module.exports = mongoose.model('Comment', commentSchema);