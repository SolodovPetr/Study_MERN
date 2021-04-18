const mongoose = require('mongoose');
require('dotenv').config();


const articleSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 100,
        required: [ true, 'Title is required' ]
    },
    content: {
        type: String,
        required: [ true, 'Content is required' ]
    },
    excerpt: {
        type: String,
        required: [ true, 'Excerpt is required' ],
        maxLength: 500,
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    director: {
        type: String,
        required: true
    },
    actors: {
        type: [ String ], // array of strings
        validate: {
            validator: function (array) {
                return array.length >= 2;
            },
            message: 'At least 2 actors required'
        },
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: [ 'draft', 'public' ],
        default: 'draft',
        index: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const Article = mongoose.model('Article', articleSchema);

module.exports = { Article }
