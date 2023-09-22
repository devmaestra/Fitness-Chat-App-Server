const router = require('express').Router()
const Conversation = require('../models/conversation.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT
const validateSession = require('../middleware/validate-session')


// Error Response function
const errorResponse = (res, error) => {
    return(
        res.status(500).json({
            error: error.message
        })
    )
}

//TODO POST - create Conversation
router.post('/', validateSession, async (req, res) => {
    try {
        
        //1. Pull data from our client (body)
        const { title, description, messages, ownerName} = req.body;

        //2. Create a new object using the Model
        const conversation = new Conversation({
            title, description, messages,
            owner_id: req.user.id, ownerName
        });

        //3. Use mongoose method to save to MongoDB (storing it)
        const newConversation = await conversation.save();

        //4. Client response
        res.status(200).json({
        newConversation,
        message: `${newConversation.title} added to collection!`
    })

    } catch (err) {
        errorResponse(res, err);
    }
});

module.exports = router;