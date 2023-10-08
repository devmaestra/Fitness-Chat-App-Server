const router = require('express').Router();
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT;
const config = require('../helpers/config');
const nodemailer = require('nodemailer');


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
            admin: false
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

//! FORGOT PASSWORD & SEND EMAIL//

router.post('/forgot-password', validateSession, async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      return res.json({ status: "User Does Not Exist" });
    }

    const SECRET = process.env.SECRET; 
    const secret = SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "5m" });

    const link = `http://localhost:4001/user/reset/${oldUser._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      text: `Click this ${link} to reset your password for the Swoulmates App`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(400).json({ message: "Error sending email" });
      } else {
        return res.status(200).json({ message: "Email Sent" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
// console.log(link);

//     } catch (error) {}
// });

router.get('/reset-password/:id/:token', async (req,res) => {
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if(!oldUser){
        return res.json({ status: "User Does Not Exist" });
    }
    const secret = JWT + oldUser.password; //JWT vs. jwt?
    try {
        const verify = jwt.verify(token, secret);
        // res.send("Verified");
        res.render("forgot", { email: verify.email, status: "Not Verified"});
    } catch (error) {
        res.send("Not Verified");
    }
    // res.send("Done"); //remove this later once verified messages come through
});

router.post('/reset-password/:id/:token', validateSession, async (req,res) => {
    const { id, token } = req.params;
    // console.log(req.params); do first
    const { password } = req.body;
    const oldUser = await User.findOne({ _id: id });
    if(!oldUser){
        return res.json({ status: "User Does Not Exist"});
    }
    const secret = jwt + oldUser.password; //JWT vs. jwt?
    try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = await bcryct.hash(password, 10);
        await User.updateOne({
            _id: id,
        },
        {
         $set: {
            password: encryptedPassword,
         },
        }
        );
        res.json({ status: "Password Updated" });
        // res.send("Verified");done first to make sure it is connected
        res.render("index", { email: verify.email, status:"verified" });
    } catch (error) {
        console.log(error);
        res.json({ status: "Something Went Wrong" });
    }
    res.send("Done"); //remove this later once verified messages come through
});

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



//! Function to Fetch based on Category
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

