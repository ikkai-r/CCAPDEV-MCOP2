const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {
        type:mongoose.Schema.Types.ObjectId, ref:'Account'
    },
    post_title: {
        type: String,
        required: true,
        min: 1,
        max: 50,
    },
    post_content: {
        type: String,
        required: true,
        min: 1,
    },
    post_attachment: {
        type: String,
        max: 1
    },
    post_date: {
        type: Date,
        default: () => Date.now(),
    },
    post_date_modified: Date,
    comments: [{
        type: mongoose.Schema.Types.ObjectId, ref:'Comment',
    }],
    tags: [{
        type: mongoose.Schema.Types.ObjectId, ref:'Tag',
    }]

})

module.exports = mongoose.model('Post', postSchema);