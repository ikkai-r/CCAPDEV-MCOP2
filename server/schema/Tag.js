const mongoose = require("mongoose");
const tagSchema = new mongoose.Schema({
    tag_name: {
        type: String,
        required: true
    },
    photo:{
        type: String,

    }

})

module.exports = mongoose.model('Tag', tagSchema);