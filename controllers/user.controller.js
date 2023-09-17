const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT;

router.post('/signup', async (req, res) => {

    try {

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 13),
            // locationZip: 
            // firstName: 
            // lastName:
            // bioTagline:
            // bioParagraph:
            // userImage: 
        });

        const newUser = await user.save();
        const token = jwt.sign({id: newUser._id}, SECRET, {expiresIn: "1 day"});  // from Jake's notes

        res.status(200).json({
            user: newUser,
            message: 'Success!',
            token
        })


    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
});

module.exports = router;

