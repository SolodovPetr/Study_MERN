const express = require('express');
const router = express.Router();

// Model
const { Article } = require('../../models/article_model');
// Middleware
const { checkUserExists } = require('../../middleware/auth');
const { grantAccess}  = require('../../middleware/roles');


// Create article
router.route('/admin/add_article')
    .post( checkUserExists, grantAccess('createAny', 'article'), async (request, response) => {
        try {
            // create model
            const article = new Article({
                ...request.body,
                score: parseInt(request.body.score)
            });

            // save article to db
            const doc = await article.save();
            response.status(200).json(doc);
        } catch (error) {
            response.status(400).json({message: 'Add article error', error});
        }
    });


module.exports = router;
