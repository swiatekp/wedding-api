const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/verifyToken');
const config = require('../config');

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

router.get('/', verifyToken, (req, res) => {
    //get all guests
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            getGuestNonAdmin(req, res);
        }
        else {
            getGuests(req, res);
        }
    })
});

router.get('/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            //if not logged as admin, use the function with limited access
            getGuestByIdNonAdmin(req, res);
        }
        else {
            //if logged ass admin, use the function with unlimited access
            getGuestByIdAdmin(req, res);
        }
    })
});

router.post('/', verifyToken, (req, res) => {
    //adding a new guest - admin only
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
        else {
            addGuest(req, res);
        }
    })
});
router.delete('/:id', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
        else {
            deleteGuest(req, res);
        }
    })
});
router.put('/:id', verifyToken, (req, res) => {
    //Guest edition - admin only
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
        else {
            editGuest(req, res);
        }
    })
});
router.put('/:id/confirm', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            confirmNonAdmin(req, res);
        }
        else {
            confirmAdmin(req, res);
        }
    })
});

router.all('*', (req, res) => {
    res.status(400);
    res.json({ error: 'Bad request' });
})

module.exports = router;