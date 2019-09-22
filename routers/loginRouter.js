const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../helpers/db');
const config = require('../config');
const jwt = require('jsonwebtoken');

router.post('/', (req, res) => {
    if (req.body) {
        if (req.body.login && req.body.password) {
            if (typeof req.body.login === "string" && typeof req.body.password === "string") {
                if (req.body.login.length !== "" && req.body.password.length !== "") {
                    db.get().collection('admins').find({ login: req.body.login }).toArray((err, admin) => {
                        if (err) {
                            res.status(500);
                            res.json({ error: 'Internal server error' });
                        }
                        else if (admin.length !== 1) {
                            res.status(401);
                            res.json({ error: 'No such login' });
                        }
                        else {
                            const passwordHashed = crypto.createHash('sha256').update(req.body.password).digest('hex');
                            const { login, firstName, lastName } = admin[0];
                            if (admin[0].password === passwordHashed) {
                                jwt.sign({
                                    login,
                                    firstName,
                                    lastName
                                }, config.jwtSecretKey, { expiresIn: '3h' }, (err, token) => {
                                    if (err) {
                                        res.status(500);
                                        res.json({ error: 'Authentication failed - internal server error' });
                                    }
                                    else {
                                        res.json({ token });
                                    }
                                })
                            }
                            else {
                                res.status(401);
                                res.json({ error: 'Wrong password' });
                            }
                        }
                    });
                }
                else {
                    res.status(400);
                    res.json({ error: 'Login and password should not be empty strings' });
                }
            }
            else {
                res.status(400);
                res.json({ error: 'Login and password should be strings.' })
            }
        }
        else {
            res.status(400);
            res.json({ error: 'No login and password specified in the request body' });
        }
    }
    else {
        res.status(400);
        res.json({ error: 'No request body has been sent' });
    }
});

module.exports = router;