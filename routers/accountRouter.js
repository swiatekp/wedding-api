const express = require('express');
const router = express.Router();
const respondWithAnError = require('../helpers/guests/respondWithAnError');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/verifyToken');
const config = require('../config');

const changePassword = require('../helpers/changePassword');
const isPasswordCorrect = require('../helpers/isPasswordCorrect');

module.exports = router;

router.post('/changepassword', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            respondWithAnError(res, 403, 'Brak dostępu');
        }
        else {
            changePassword(req, res);
        }
    });
});

router.post('/ispasswordcorrect', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            respondWithAnError(res, 403, 'Brak dostępu');
        }
        else {
            isPasswordCorrect(req, res);
        }
    });
});