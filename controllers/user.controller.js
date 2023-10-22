const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT;
const nodemailer = require('nodemailer');
const config = require('../helpers/config')
//* UPDATED *

//TODO Validate Session
const validateSession = require('../middleware/validate-session');

// Error Response function
const errorResponse = (res, error) => {
    return (
        res.status(500).json({
            error: error.message
        })
    )
}

//TODO Get Logged In User's Data
// Get Logged In User's Data
router.get('/loggeduser', validateSession, async (req, res) => {
    try {
        // Get the user data from the request object (provided by the validateSession middleware)
        const user = req.user;

        if (!user) {
            // If user data is not available, return a 404 Not Found response
            return res.status(404).json({ message: 'User data not found' });
        }

        // If user data is available, return it as a JSON response
        res.json(user);
    } catch (err) {
        // Handle any errors that occur during the process
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



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
            activityBio: req.body.activityBio,
            bioParagraph: req.body.bioParagraph,
            userImage: req.body.userImage,
            friends: req.body.friends,
            active: true,
            admin: false,
            userImage: '/assets/User-Profile-PNG-Image.png' // populates a default image asset
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

// });

// //TODO PATCH One - Make Updates to User Profile
// // *** ValidateSession was removed from this endpoint***

// router.patch('/:id/edit', validateSession, async (req, res) => {
//     try {

//         //1. Pull value from parameter
//         const { id } = req.params;

//         const filter = { _id: id }

//         //2. Pull data from the body
//         const info = req.body;


//         //3. Use method to locate document based off ID and pass in new info.
//         const returnOption = { new: true };


//         const updated = await User.findOneAndUpdate(filter, info, returnOption);
//         if (!updated) throw new Error('no.')

//         //4. Respond to client.
//         res.status(200).json({
//             message: `Your profile has been updated!`,

//             updated
//         })

//     } catch (err) {
//         errorResponse(res, err)
//     }
// })


//TODO // Define a route to update a user's profile
router.patch('/:id/edit', validateSession, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body; // The updates to apply

        // Check if the user exists
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Apply updates
        Object.keys(updates).forEach((key) => {
            user[key] = updates[key];
        });

        // Save the updated user
        const updatedUser = await user.save();

        res.status(200).json({ message: 'Profile updated', user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//TODO DELETE One - Delete User by ID
router.delete('/:id', validateSession, async (req,res) => {

    try {

        //1. Pull value from parameters
        const { id } = req.params;

        //2. Pull value from User auth
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

// TODO Get One - GET ONE USER by ID
router.get('/getoneuser/:id', validateSession, async (req,res) => {

    try {

        //1. Pull value from parameters
        const { id } = req.params;

        console.log(`UserID submitted: ${id}`);

        //2. Use find method to locate based off ID param
        const getUser = await User.find({_id: id});
        console.log(getUser);

        //4. Respond to client
        getUser ?
            res.status(200).json({
                getUser,
            }) :
            res.status(404).json({
                message: 'No such user in collection.'
            })
            
    } catch (err) {
        errorResponse(res, err);
    }
})

// ! Function to Fetch based on Category
// function fakeStore(endpoint) {  // FakeStore Function
//     fetch(baseURL + endpoint)
//         .then((res) => res.json())
//         .then((data) => {           // Process the fetched items data
//             let eachObj = data.map((item) => ({
//                 id: item.id,
//                 title: item.title,
//                 desc: item.description,
//                 price: item.price,
//                 img: item.image,
//                 category: item.category
//             }));

//             displayCards(eachObj);
//         })
//         .catch((err) => {
//             console.error('Error:', err);
//         });
// }

//! Function to Fetch Zips based on userZip and radius:

async function fetchZipData (userZip, radius) {
    const apiKey = config.apiKey;
    const apiUrl = `${config.apiUrl}?zip=${userZip}&radius=${radius}&showcity=true&key=${apiKey}`;

    // console.log(config.apiKey);
    // console.log(config.apiUrl);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log('API Response:', data); // Output to see the structure of the API response

        return data; // This should be the response object containing zip codes and distances
    }   catch (error) {
        console.error('Error fetching zip code data:', error);
        throw error;
    }
}

//TODO Get All Matches for logged in user based on Zip Codes:

router.get('/matches', validateSession, async (req, res) => {

    //1. Pull value from User Auth
    const userId = req.user.id;
    const userName = req.user.username;
    const userZip = req.user.locationZip;
    const radius = 6;
    // const localRadiusZips = [ 49735, 49700, 49811, 49800, 49810 ];

    try {

        const localRadiusData = await fetchZipData(userZip, radius);

        // Ensure that localRadiusData has the expected structure
        if (!Array.isArray(localRadiusData.output)) {
            throw new Error('API response does not have the expected structure.');
        }

        const localRadiusZips = localRadiusData.output.map(entry => entry.zip); // extract zip codes
        const localRadiusCities = localRadiusData.output.map(entry => entry.city); // extract zip codes
        console.log(localRadiusZips);
        console.log(localRadiusCities);

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
        
        //FIXME -  let locals = [];

        // for(let i = 0; i <= getMatchByZip.length; i++) {
        //     let user = await User.find({locationZip: getMatchByZip[i]}).limit(3)
        //     locals.push(user)
        // }

        console.log(`Logged in as ${userName}. ID: ${userId} Here are your MATCHES:`);
        console.log(matchNames);
        console.log(matchIds);
        console.log(matchData);
        console.log(getMatchByZip);

        getMatchByZip ?
            res.status(200).json({
                userId,
                userName,
                userZip,
                message:`Logged in as ${userName} (user: ${userId}) in zip ${userZip}. Here are your MATCHES:`,
                matchNames,
                matchIds,
                localRadiusCities,
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


module.exports = router;

