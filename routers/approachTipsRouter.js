const config = require('../config');

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const { verifyToken } = require('../helpers/verifyToken');
const respondWithAnError = require('../helpers/guests/respondWithAnError');

const post = require('../helpers/approachTips/post');
const getAllTips = require('../helpers/approachTips/getAllTips');
const getTipsByCategory = require('../helpers/approachTips/getTipsByCategory');
const getTipsById = require('../helpers/approachTips/getTipsById');
const deleteTip = require('../helpers/approachTips/deleteTip');

module.exports = router;

router.get('/', verifyToken, (req, res) => {
    //get all tips
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            respondWithAnError(res, 403, 'Brak dostępu');
        }
        else {
            getAllTips(req, res);
        }
    });
});
router.get('/by-category/:category', verifyToken, (req, res) => {
    //get tips by category
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            respondWithAnError(res, 403, 'Brak dostępu');
        }
        else {
            getTipsByCategory(req, res);
        }
    });
});
router.get('/by-id/:id', verifyToken, (req, res) => {
    //get tips by id
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            respondWithAnError(res, 403, 'Brak dostępu');
        }
        else {
            getTipsById(req, res);
        }
    });
});
router.post('/', verifyToken, (req, res) => {
    //add new Tip
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            respondWithAnError(res, 403, 'Brak dostępu');
        }
        else {
            post(req, res);
        }
    });
});
router.delete('/:id', verifyToken, (req, res) => {
    //remove tip
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            respondWithAnError(res, 403, 'Brak dostępu');
        }
        else {
            deleteTip(req, res);
        }
    });
})