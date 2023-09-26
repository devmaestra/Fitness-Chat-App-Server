const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        unique: true,
    },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],

    messages: [{ 
        text: String, 
        username: String, 
        date: Date,
        owner_Id: String,
        target_Id: String,
        targetUsername: String, // Include targetUsername for each message
    }],

    owner_Id: {
    type: mongoose.Types.ObjectId,
    ref: 'User', // Refers to 'User' collection for referencing the conversation owner
    },

    ownerName: {
        type: String,
        ref: 'User',
    },

});

module.exports = mongoose.model('Conversation', ConversationSchema);