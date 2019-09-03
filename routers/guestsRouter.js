const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/verifyToken');
const config = require('../config');

const getGuests = require('../helpers/guests/getGuests');
const addGuest = require('../helpers/guests/addGuest');

router.get('/', verifyToken, (req, res) => {
    //get all guests
    //admin only
    jwt.verify(req.token, config.jwtSecretKey, (err) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
        else {
            getGuests(req, res);
        }
    })
});

router.get('/:id', (req, res) => {
    res.send('pobieranie konkretnego gościa-dostęp dla admina oraz po przekazaniu tokenu');
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
            res.json({
                message: 'Guest has been deleted'
            });
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
            res.json({
                message: 'Guest has been edited'
            });
        }
    })
});
router.put('/:id/confirm', (req, res) => {
    //Potwierdzenie przybycia
    //Tylko admin oraz użytkownik z tokenem
});

router.all('*', (req, res) => {
    res.status(400);
    res.json({ error: 'Bad request' });
})

module.exports = router;