const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/verifyToken');
const config = require('../config');
module.exports = router;

router.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
        else {
            res.json({ message: 'panel admina - no elo' });
        }
    })
});