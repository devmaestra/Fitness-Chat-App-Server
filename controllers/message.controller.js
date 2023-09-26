const router = require('express').Router();
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const { formatDate } = require('../helpers/dateUtils'); //! new DATE handling
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

const currentDate = new Date(); //! new DATE handling
const formattedDate = formatDate(currentDate); //! new DATE handling
// console.log(formattedDate); // Example output: "2023-09-25 21:42:12 EDT"
console.log(`Formatted DATE is ${formattedDate}`);

//* -----------------------------------------------------------------------
//TODO POST - create a message for a Conversation
router.post('/', validateSession, async (req, res) => {

    try {
        //1. Pull data from client (body)
        const { text } = req.body;
        const owner_Id = req.user.id;
        const username = req.user.username
        const { conversation_Id, target_Id, targetUsername } = req.body;
        // const conversation_Id = req.params.conversation_Id;
        
// After extracting values from req.body //! CONSOLE LOGS
        console.log(`Received target_Id: ${target_Id}`);
        console.log(`Received targetUsername: ${targetUsername}`);
        console.log(`Received conversation_Id: ${conversation_Id}`);

        // console.log(username)
        // console.log(`target_Id:`, target_Id);
        // console.log(`targetUsername:`, targetUsername);

        //2. Create new object using the Model
        const message = new Message({
            text,
            date: formattedDate, // new Date(),  //! new DATE handling
            username,
            owner_Id, // declared above
            target_Id,
            targetUsername, // include the targetUsername
        });

        //3. Use mongoose method to save to MongoDB
        const newMessage = await message.save();
        console.log(newMessage); //! CONSOLE LOG

        const conversationMessage = {
            _id: newMessage._id,
            text: newMessage.text,
            date: newMessage.date,
            username: newMessage.username,
            owner_Id: newMessage.owner_Id,
            target_Id: target_Id,
            targetUsername: targetUsername, // Include targetUsername
        };
        // console.log(`conversationMessage:`, conversationMessage, `.`); //! CONSOLE LOG
        
        try {
            const updatedConversation = await Conversation.findOneAndUpdate(
                { _id: conversation_Id },
                { $push: { messages: conversationMessage } },
                { new: true } // To return the updated document
            );

            console.log(`findOneAndUpdate:`, conversationMessage, `.`); //! CONSOLE LOG
        
            if (!updatedConversation) {
                return res.status(404).json({ error: 'Conversation not found' });
            }
        
            // If the update is successful, return a success response
            return success(res, updatedConversation);
        } catch (err) {
            error(res, err);
        }


        newMessage ? success(res, newMessage) : incomplete(res);
    } catch (err) {
        error(res, err);
    }
});


module.exports = router;
