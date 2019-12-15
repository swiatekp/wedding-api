const express = require('express');
const router = express.Router();
const { verifyUid } = require('../helpers/verifyUid');

const changePassword = require('../helpers/changePassword');
const isPasswordCorrect = require('../helpers/isPasswordCorrect');

module.exports = router;

router.post('/changepassword', verifyUid, (req, res) => {
    changePassword(req, res);
});

router.post('/ispasswordcorrect', verifyUid, (req, res) => {
    isPasswordCorrect(req, res);
});