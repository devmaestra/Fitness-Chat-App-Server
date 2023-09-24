const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        unique: true,
    },

    // description: {
    //     type: String,
    //     required: false, 
    // },

    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    
    // messages: [{ 
    //     text: String, 
    //     username: String, 
    //     date: Date,
    // }],

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

    // target_Id: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'User', // Refers to 'User' collection for referencing the conversation target
    // },

    ownerName: {
        type: String,
        ref: 'User',
    },

});

module.exports = mongoose.model('Conversation', ConversationSchema);


// *JAKE CONVERSATION MODEL REFRENCE*

// const mongoose = require('mongoose');

// const ConversationSchema = new mongoose.Schema({
    
//     senderID: {
//         type: String,  //! ObjectId, ref: User ?
//         required: true,
//     },
//     user02: {
//         type: String,  //! ObjectId, ref: User ?
//         required: true,
//     },
//     members: [{
//         user: mongoose.Types.ObjectId,
//         ref: 'User'
//     }
//     ],
//     messages: [
//         { 
//             _id: String, 
//             text: String, 
//             timestamp: Date, //! format to correct Timestamp

//             // createdStamp: Date, //! format to correct Timestamp
//             // updatedStamp: Date, //! format to correct Timestamp

//         }],

// });

// module.exports = mongoose.model('Conversation', ConversationSchema);