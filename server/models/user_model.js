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

// hash password before store to db
userSchem.pre('save', async function (next) {
    const user = this;
    if ( user.isModified('password') ) {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password = hash;
    }
    next();
});

// generate token
userSchem.methods.generateToken = function () {
    const user = this;
    const userObj = { _id: user._id.toHexString(), email: user.email };
    const token = jwt.sign(userObj, process.env.DB_SECRET, {expiresIn: '1d'});
    return token;
}

// check for email to be unique in db
userSchem.statics.emailExist = async function (email) {
    const user = await this.findOne({email});
    return !!user;
}

const User = mongoose.model('User', userSchem);

module.exports = { User }
