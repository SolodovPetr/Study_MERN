const express = require('express');
const router = express.Router();

// Model
const { Article } = require('../../models/user_model');
// Middleware
const { checkUserExists } = require('../../middleware/auth');
const { grantAccess}  = require('../../middleware/roles');





module.exports = router;
