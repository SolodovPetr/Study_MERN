const express = require('express');
const router = express.Router();
require('dotenv').config();

const { User } = require('../../models/user_model');
const { checkUserExists } = require('../../middleware/auth');

// Register
router.route('/register')
    .post( async (request, response ) => {
        try {
            // check email to be unique
            if ( await User.emailExist(request.body.email) ) {
                return response.status(400).json({message: 'Email already exist.'});
            }

            // create model
            const user = new User({
                email: request.body.email,
                password: request.body.password
            });

            // generate token
            const token = user.generateToken();

            // hash password on pre-save action
            const doc = await user.save();

            // TODO: send email

            response.cookie('x-access-token', token)
                .status(200).send( getUserProps(doc) );
        } catch (error) {
            response.status(400).json({message: 'Auth error', error});
        }
    });

/**
 * @param user object
 * @returns {{_id, email, role}}
 */
const getUserProps = user => ({
   _id: user._id,
   email: user.email,
   role: user.role
});

// Sign In
router.route('/signin')
    .post( async (request, response) => {
        try {
            // get user from db by email
            const user = await User.findOne({email: request.body.email});
            if ( !user ) {
                return response.status(400).json({message: 'Wrong email'});
            }

            // compare password
            const compare = await user.comparePassord(request.body.password);
            if ( !compare ) {
                return response.status(400).json({message: 'Wrong password'});
            }

            // generate token
            const token = user.generateToken();
            // set cookie with token
            response.cookie('x-access-token', token)
                .status(200).send( getUserProps(user) );

        } catch (error) {
            response.status(400).json({message: 'Sign In error', error});
        }
    });

// Profile
router.route('/profile')
    .get( checkUserExists, async (request, response) => {
        response.status(200).send('Profile');
    });

module.exports = router;
