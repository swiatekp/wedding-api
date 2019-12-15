const config = require('../config');

const express = require('express');
const router = express.Router();

const { verifyUid } = require('../helpers/verifyUid');
const respondWithAnError = require('../helpers/guests/respondWithAnError');

const post = require('../helpers/approachTips/post');
const getAllTips = require('../helpers/approachTips/getAllTips');
const getTipsByCategory = require('../helpers/approachTips/getTipsByCategory');
const getTipsById = require('../helpers/approachTips/getTipsById');
const deleteTip = require('../helpers/approachTips/deleteTip');
const moveUp = require('../helpers/approachTips/moveUp');
const moveDown = require('../helpers/approachTips/moveDown');
const edit = require('../helpers/approachTips/edit');
const changeImage = require('../helpers/approachTips/changeImage');
const removeIllustration = require('../helpers/approachTips/removeIllustration');
module.exports = router;

router.get('/', (req, res) => {
    getAllTips(req, res);
});
router.get('/by-category/:category', verifyUid, (req, res) => {
    //get tips by category
    getTipsByCategory(req, res);
});
router.get('/by-id/:id', verifyUid, (req, res) => {
    //get tips by id
    getTipsById(req, res);
});
router.post('/', verifyUid, (req, res) => {
    //add new Tip
    post(req, res);
});
router.delete('/:id', verifyUid, (req, res) => {
    deleteTip(req, res);
});
router.delete('/remove-illustration/:id', verifyUid, (req, res) => {
    removeIllustration(req, res);
});
router.put('/moveup/:id', verifyUid, (req, res) => {
    moveUp(req, res);
});
router.put('/movedown/:id', verifyUid, (req, res) => {
    //move the tip up the list
    moveDown(req, res);
});

router.put('/changeimage/:id', verifyUid, (req, res) => {
    changeImage(req, res);
});

router.put('/:id', verifyUid, (req, res) => {
    edit(req, res);
});
