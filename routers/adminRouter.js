const express = require('express');
const router = express.Router();
const { verifyUid } = require('../helpers/verifyUid');
module.exports = router;

router.get('/*', verifyUid, (req, res, next) => {
    //there are two middlewares in index.js that use /admin path
    //first one is this one. It checks if the user is logged in
    //If it is - use the next middleware - make a static folder with admin panel frontend
    next();

});