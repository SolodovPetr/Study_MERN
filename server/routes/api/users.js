const express = require('express');
const router = express.Router();
require('dotenv').config();

const { User } = require('../../models/user_model');

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

            // hash password on pre-save action
            const doc = await user.save();

            response.cookie('x-access-token', 'token-value')
                .status(200).send(doc);
        } catch (error) {
            response.status(400).json({message: 'Auth error', error});
        }
    });

module.exports = router;
