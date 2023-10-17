const mongoose = require("mongoose");

const Links = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Links', Links);