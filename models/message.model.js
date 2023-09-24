const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    date: {
        type: String, // Date
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    owner_Id: {
        // type: String, 
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    username: {
        type: String,
    },
    conversation_Id: {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
});

module.exports = mongoose.model('Message', MessageSchema);