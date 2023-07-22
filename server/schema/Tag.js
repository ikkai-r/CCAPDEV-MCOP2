const mongoose = require("mongoose");
const tagSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    tag_name: {
        type: String,
        required: true
    },
    photo:{
        type: String,

    }

})

module.exports = mongoose.model('Tag', tagSchema);