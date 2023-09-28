const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../helpers/keys');
const SECRET = process.env.JWT;

//* Validate Session
const validateSession = require('../middleware/validate-session');

// Error Response function
const errorResponse = (res, error) => {
    return (
        res.status(500).json({
            error: error.message
        })
    )
}


//TODO SIGNUP
router.post('/signup', async (req, res) => {

    try {

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 13),
            locationZip: req.body.locationZip,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            bioTagline: req.body.bioTagline,
            bioParagraph: req.body.bioParagraph,
            userImage: req.body.userImage,
            friends: req.body.friends,
            active: req.body.active,
        });

        const newUser = await user.save();
        const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1 day" });  // from Jake's notes

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

//TODO LOGIN

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!user || !passwordMatch) throw new Error('Email or Password does not match');
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1 day" });

        res.status(200).json({
            message: `Success!`,
            user,
            token
        })

    } catch (err) {
        res.status(500).json({
            error: err.message
        })
    }
})


//TODO PATCH One - Make Updates to User Profile
// *** ValidateSession was removed from this endpoint***

router.patch('/:id/edit', async (req, res) => {
    try {

        //1. Pull value from parameter
        const { id } = req.params;

        const filter = { _id: id }

        //2. Pull data from the body
        const info = req.body;


        //3. Use method to locate document based off ID and pass in new info.
        const returnOption = { new: true };


        const updated = await User.findOneAndUpdate(filter, info, returnOption);
        if (!updated) throw new Error('no.')

        //4. Respond to client.
        res.status(200).json({
            message: `Your profile has been updated!`,

            updated
        })

    } catch (err) {
        errorResponse(res, err)
    }
})


//TODO DELETE One - Delete User by ID
router.delete('/:id', validateSession, async (req,res) => {

    try {

        //2. Pull value from parameters
        const { id } = req.params;

        //1. Pull value from User auth
        // const userId = req.user.id;
        const userName = id.username;
        console.log(userName);


        //3. Use delete method to locate and remove based off ID
        const deleteUser = await User.deleteOne({_id: id});

        //4. Respond to client
        deleteUser.deletedCount ?
            res.status(200).json({
                message: "User deleted from collection."
                // message: "User " + userName + " deleted from collection." //! To Fix
            }) :
            res.status(404).json({
                message: 'No such user in collection.'
            })
                
    } catch (err) {
        errorResponse(res, err);
    }
})

//TODO Get All Matches for logged in user based on Zip Codes:

// router.get(FREEMAPURL/)
router.get('/matches', validateSession, async (req, res) => {

    //1. Pull value from User auth
    const userId = req.user.id;
    const userName = req.user.username;
    const userZip = req.user.locationZip;
    const localRadiusZips = [ 49735, 49700, 49811, 49800, 49810 ];

    try {

        let getMatchByZip = await User.find({ locationZip: { $in: localRadiusZips }, active: true }); // Use ARRAY to find by Zip Code if Active: true.
        // let getMatchByZip = await User.find({locationZip: userZip, active: true}); // Find by Zip Code if Active: true.
        const removedSelf = getMatchByZip.filter(user => user.id !== userId);

        getMatchByZip = removedSelf; // Reassign the array of matches, after filtering out SELF.

        const matchNames = getMatchByZip.map(user => user.username); // Extract Names from the Find into a new Array.
        const matchIds = getMatchByZip.map(user => user.id); // Extract Names from the Find into a new Array.

        const matchData = getMatchByZip.map(user => ({
            name: user.username,
            id: user.id
        }));

        // let locals = [];

        // for(let i = 0; i <= getMatchByZip.length; i++) {
        //     let user = await User.find({locationZip: getMatchByZip[i]}).limit(3)
        //     locals.push(user)
        // }

        console.log(`Logged in as ${userName}. Here are your MATCHES:`);
        console.log(matchNames);
        console.log(matchIds);
        console.log(matchData);
        console.log(getMatchByZip);

        getMatchByZip ?
            res.status(200).json({
                message:`Logged in as ${userName} (user: ${userId}). Here are your MATCHES:`,
                matchNames,
                matchIds,
                matchData,
                getMatchByZip
            }) :
            res.status(404).json({
                message: `No zipcode matches found.`
            });

    } catch (err) {
        errorResponse(res, err);
    }
});

//! WORK IN PROGRESS FOR FRONT END GET TARGETUSER BY TARGET_ID
//! On the frontend, you can make a request to /api/users/:target_Id with the target_Id to retrieve the target user's details, including their username.

//TODO Backend API endpoint to get target user details by target_Id
// app.get('/api/users/:target_Id', (req, res) => {
//     const { target_Id } = req.params;

//     // Fetch target user's details from your User model
//     User.findOne({ _id: target_Id })
//         .then(targetUser => {
//             // Respond with the target user's details
//             res.json(targetUser);
//         })
//         .catch(err => {
//             // Handle errors if user not found, etc.
//             res.status(500).json({ error: err.message });
//         });
// });


module.exports = router;

