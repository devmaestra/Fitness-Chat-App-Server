const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: false, 
    },
    messages: {
        type: Array,
        
    },

    owner_id: {
        type: String,
    },

});

module.exports = mongoose.model('Conversation', ConversationSchema);


// *JAKE CONVERSATION MODEL REFRENCE*

// const mongoose = require('mongoose');

// const ConversationSchema = new mongoose.Schema({
//     user01: {
//         type: String, //! ObjectId, ref: User ?
//         required: true,
//     },
//     user02: {
//         type: String,  //! ObjectId, ref: User ?
//         required: true,
//     },
//     senderID: {
//         type: String,  //! ObjectId, ref: User ?
//         required: true,
//     },
//     members: [{
//         user: mongoose.Types.ObjectId,
//         ref: 'User'
//     }
// ],
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