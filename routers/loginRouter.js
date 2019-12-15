const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../helpers/db');
const { verifyUid } = require('../helpers/verifyUid');
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
                            const { _id, password } = admin[0];
                            if (password === passwordHashed) {
                                req.session.uid = _id
                                res.json({ message: 'Udało się' });
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
router.get('/', verifyUid, (req, res) => {
    res.redirect('/admin');
});
router.get('/logout', (req, res) => {
    logout(req, res);
});
router.all('*', (req, res) => {
    res.status('400');
    res.json({ error: 'Bad request' });
})
module.exports = router;