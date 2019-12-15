const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../helpers/db');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../helpers/verifyToken');
const logout = require('../helpers/logout');

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
                            res.json({ error: 'Zły login' });
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
                                        res.json({ error: 'Wewnętrzny błąd serwera' });
                                    }
                                    else {
                                        req.session.token = token; //put the token in session
                                        res.json({ message: 'Udało się' });
                                    }
                                })
                            }
                            else {
                                res.status(401);
                                res.json({ error: 'Nieprawidłowe hasło' });
                            }
                        }
                    });
                }
                else {
                    res.status(400);
                    res.json({ error: 'Login i hasło nie mogą być puste' });
                }
            }
            else {
                res.status(400);
                res.json({ error: 'Login i hasło powinny być ciągami znaków' })
            }
        }
        else {
            res.status(400);
            res.json({ error: 'Nie podano loginu i hasła' });
        }
    }
    else {
        res.status(400);
        res.json({ error: 'No request body has been sent' });
    }
});
router.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err, authData) => {
        if (err) {
            res.redirect('/loginform');
        }
        else {
            res.redirect('/admin');
        }
    })
});
router.get('/logout', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err, authData) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Brak dostępu' });
        }
        else {
            logout(req, res);
        }
    })
})
router.all('*', (req, res) => {
    res.status('400');
    res.json({ error: 'Bad request' });
})
module.exports = router;