const { User } = require('../models/user_model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Check token
exports.checkToken = async function (request, response, next) {
    try {
        if ( request.headers['x-access-token'] ) {
            // get and verify token
            const token = request.headers['x-access-token'];
            const { _id, email, exparetion } = jwt.verify(token, process.env.DB_SECRET);
            // assume get user form db using _id from token
            response.locals.userData = await User.findById(_id);
            next()
        } else {
            next();
        }
    } catch (error) {
        return response.status(401).json({message: 'Wrong token', error});
    }
}

// Check user exists in db
exports.checkUserExists = function (request, response, next) {
    const user = response.locals.userData;
    if ( !user ) {
        return response.status(401)
            .json({message: 'User not found.'});
    }
    // add user data to request
    request.user = user;
    next();
}