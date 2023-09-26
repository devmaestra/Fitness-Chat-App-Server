const router = require('express').Router()
const Conversation = require('../models/conversation.model')
const Message = require('../models/')
const User = require('../models/user.model') // Import the User Model
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT
const validateSession = require('../middleware/validate-session')
const { formatDate } = require('../helpers/dateUtils'); //! new DATE handling



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
        const { title, users } = req.body;

        //2. Get the username of the currently logged-in user
        const username = req.user.username;

        //3. Create a new object using the Model
        const conversation = new Conversation({
            title,
            users, 
            messages: [], // Initializes messages as an empty arry
            owner_Id: req.user.id,
            ownerName: username, // Set ownername to the username of the logged-in user
        });

        //3. Use mongoose method to save to MongoDB (storing it)
        const newConversation = await conversation.save();

        //4. Client response
        res.status(200).json({
        newConversation,
        message: `${newConversation.title} added to Conversation collection!`
    })

    } catch (err) {
        errorResponse(res, err);
    }
});

//TODO ADMIN: Get all conversations by all users
router.get('/', validateSession, async(req, res) => {

    try {

        const getAllConversations = await Conversation.find();

        getAllConversations ?
            res.status(200).json({
                getAllConversations
            }) :
            res.status(404).json({
                message: `No conversations found`
            });

    } catch (err) {
        errorResponse(res, err);
    }
});


//TODO Get All Conversations including logged in user:
// future devs: keyword here is getAllConversations for FE
router.get('/myconversations', validateSession, async(req, res) => {

    const userId = req.user.id

    try {

        const getAllConversations = await Conversation.find({users: userId});

        getAllConversations ?
            res.status(200).json({
                getAllConversations
            }) :
            res.status(404).json({
                message: `No conversations found`
            });

    } catch (err) {
        errorResponse(res, err);
    }
});

//TODO Delete A Conversation (if owner)
router.delete('/:id', validateSession, async(req, res) => {
    try {
        const { id } = req.params;

        const deleteConversation = await Conversation.deleteOne({_id: id, owner_Id: req.user.id});

        deleteConversation.deletedCount ?
            res.status(200).json({
                message: 'Conversation deleted!'
            }) :
            res.status(404).json({
                message: "No conversation in collection!"
            })
        
    } catch (err) {
        errorResponse(res, err);
    }
});

module.exports = router;