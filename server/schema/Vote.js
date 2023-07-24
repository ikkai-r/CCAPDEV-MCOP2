const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    post_comment:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'post_comment_model'
    },
    post_comment_model:{
        type: String,
        required: true,
        enum: ['Post', 'Comment']
    }  ,
    username: {
        type: mongoose.Schema.Types.ObjectId, ref:'Account',
        required: true,
    },
    up_downvote: {
        type: String,
        enum: ['up', 'down']
    }

})

module.exports = mongoose.model('Vote', voteSchema);