const db = require('./db');
const respondWithAnError = require('./guests/respondWithAnError');
module.exports = (req, res) => {
    const collection = db.get().collection('token-blacklist');
    if (req.token) {
        collection.insertOne({ token: req.token }, err => {
            if (err) {
                res.status('500');
                res.json({ message: 'Błąd serwera' });
            }
            else {
                console.log(req.session)
                req.session.destroy(err => {
                    if (err) {
                        respondWithAnError(res, 500, 'Błąd serwera')
                    }
                    else {
                        res.clearCookie('sid');
                        res.clearCookie('token');
                        res.json({ message: 'Wylogowano pomyślnie' })
                    }
                });
            }
        })
    }
    else {
        res.status('403');
        res.json({ message: 'Brak dostępu' });
    }
}