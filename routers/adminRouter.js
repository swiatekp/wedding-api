const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/verifyToken');
const config = require('../config');
module.exports = router;

router.get('/*', verifyToken, (req, res, next) => {
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
        else {
            //there are two middlewares in index.js that use /admin path
            //first one is this one. It checks if the user is logged in
            //If it is - use the next middleware - static folder with admin panel frontend
            console.log('AdminRouter - OK');
            next();
        }
    })
});