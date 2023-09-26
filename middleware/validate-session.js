const jwt = require('jsonwebtoken');
const User = require('../models/user.model');


const validateSession = async(req,res,next) => {

    try {
        //1. Take token provided by the request object (headers.authorization)
        const token = req.headers.authorization;

    
        //2. Check the status of token. (expired?)
        const decoded = await jwt.verify(token, process.env.JWT);

    
        //3. Provide response - if valid, generate a variable that holds user info
        const user = await User.findById(decoded.id)
        req.user = user;
    
    
        return next(); // moves us onto our routes ~ onto the next line to be compiled.
    } catch (err) {
        res.json({message: err.message});
    }
}

module.exports = validateSession;