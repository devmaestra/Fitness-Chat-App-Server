const router = require('express').Router();
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
// const User = require('./user.controller')
const { error, success, incomplete } = require("../helpers");

//* Validate Session
const validateSession = require('../middleware/validate-session');

// Error Response function
const errorResponse = (res, error) => {
    return (
        res.status(500).json({
            error: error.message
        })
    )
};

//* -----------------------------------------------------------------------
//TODO POST - create a message for a Conversation
router.post('/', validateSession, async (req, res) => {

    try {
        //1. Pull data from client (body)
        const { text } = req.body;
        const conversation_Id = req.params.conversation_Id;
        const owner_Id = req.user.id;
        const username = req.user.username
        console.log(username)

        //2. Create new object using the Model
        const message = new Message({
            date: new Date(),
            text,
            owner_Id: owner_Id, // declared above
            conversation_Id: conversation_Id,
            username: username,
        });

        //3. Use mongoose method to save to MongoDB
        const newMessage = await message.save();
        const conversationMessage = {
            id: newMessage._id,
            text: newMessage.text,
            date: newMessage.date,
            username: newMessage.username,
        };
        await Conversation.findOneAndUpdate(
            { _id: conversation_Id },
            { $push: { messages: conversationMessage } }
        );

        newMessage ? success(res, newMessage) : incomplete(res);
    } catch (err) {
        error(res, err);
    }
});

module.exports = router;
