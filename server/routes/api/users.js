const express = require('express');
const router = express.Router();
require('dotenv').config();

const { User } = require('../../models/user_model');
const { checkUserExists } = require('../../middleware/auth');
const { grantAccess}  = require('../../middleware/roles');

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
   role: user.role,
   firstname: user.firstname,
   lastname: user.lastname,
   age: user.age
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
    // Read
    .get( checkUserExists, grantAccess('readOwn', 'profile'), async (request, response) => {
        // get permission from locals
        const { permission } = response.locals;
        // filter data with permission
        response.status(200).json(permission.filter(request.user._doc));
    })
    // Update
    .patch( checkUserExists, grantAccess('updateOwn', 'profile'), async (request, response) => {
        try {
            const user = await User.findOneAndUpdate(
                { _id: request.user._id },
                {
                    "$set": {
                        firstname: request.body.firstname,
                        lastname: request.body.lastname,
                        age: request.body.age
                    }
                },
                { new: true }
            );

            if ( !user ) {
                response.status(400).json({message: 'User not found for update', error});
            }
            response.status(200).json(getUserProps(user));
        } catch (error) {
            response.status(400).json({message: 'Update error', error});
        }
    });

// Update email
router.route('/update_email')
    .patch( checkUserExists, grantAccess('updateOwn', 'profile'), async (request, response) => {
        try {
            if ( await User.emailExist(request.body.newemail) ) {
                response.status(400).json({message: 'This email already taken'});
            }

            const user = await User.findOneAndUpdate(
                { _id: request.user._id },
                {
                    "$set": {
                        email: request.body.newemail
                    }
                },
                { new: true }
            );

            if ( !user ) {
                response.status(400).json({message: 'User not found for update', error});
            }

            // generate token with new email
            const token = user.generateToken();
            response.cookie('x-access-token', token)
                .status(200).send({ email: user.email });

        } catch (error) {
            response.status(400).json({message: 'Email update error', error});
        }

    });

// Is user Authenticated
router.route('/isauth')
    .get(checkUserExists, (request, response) => {
        response.status(200).send(getUserProps(request.user))
    });

module.exports = router;
