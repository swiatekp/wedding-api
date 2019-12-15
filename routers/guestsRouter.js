const express = require('express');
const router = express.Router();
const { verifyUid } = require('../helpers/verifyUid');

//helpers
const getGuests = require('../helpers/guests/getGuests'); //LIST OF ALL GUESTS - admin only
const getGuestNonAdmin = require('../helpers/guests/getGuestNonAdmin'); //Get guest by name, surname and token
const getGuestByIdAdmin = require('../helpers/guests/getGuestByIdAdmin'); // Get guests by id - version for admin
const getGuestByIdNonAdmin = require('../helpers/guests/getGuestByIdNonAdmin'); //Get guest by id and token - version for guests
const addGuest = require('../helpers/guests/addGuest');
const deleteGuest = require('../helpers/guests/deleteGuest');
const editGuest = require('../helpers/guests/editGuest');
const confirmAdmin = require('../helpers/guests/confirmAdmin');
const confirmNonAdmin = require('../helpers/guests/confirmNonAdmin');

//IF A ROUTE SHOULD ONLY BE AVAILABLE FOR ADMIN - SIMPLY PUT THE verifyUid MIDDLEWARE IN IT

router.get('/', (req, res) => {
    //get guests for all users - limited access
    getGuestNonAdmin(req, res);
});
router.get('/admin', verifyUid, (req, res) => {
    //get guests for admins - unlimited access
    getGuests(req, res);
});
router.get('/:id', (req, res) => {
    getGuestByIdNonAdmin(req, res);
});
router.get('/:id/admin', verifyUid, (req, res) => {
    getGuestByIdAdmin(req, res);
})

router.post('/', verifyUid, (req, res) => {
    //adding a new guest - admin only
    addGuest(req, res);
});
router.delete('/:id', verifyUid, (req, res) => {
    deleteGuest(req, res);
});
router.put('/:id', verifyUid, (req, res) => {
    //Guest edition - admin only
    editGuest(req, res);
});
router.put('/:id/confirm', (req, res) => {
    confirmNonAdmin(req, res);
});
router.put('/:id/confirm/admin', verifyUid, (req, res) => {
    confirmAdmin(req, res);
});
router.all('*', (req, res) => {
    res.status(400);
    res.json({ error: 'Bad request' });
})

module.exports = router;