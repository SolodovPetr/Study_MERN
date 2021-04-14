const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
require('dotenv').config();

const userSchem = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate (value) {
            if( !validator.isEmail(value) ) {
                throw new Error('Invalid email!');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    firstname: {
        type: String,
        maxLength: 50,
        trim: true
    },
    lastname: {
        type: String,
        maxLength: 50,
        trim: true
    },
    age: {
        type: Number
    },
    date: {
        type: Date,
        default: Date.now()
    }
}, {
    // timestamp: true,  --  instead of date field
    // collection: 'members'  -- set custom name
});

const User = mongoose.model('User', userSchem);

module.exports = { User }
