const db = require('./db');
const respondWithAnError = require('./guests/respondWithAnError');
module.exports = (req, res) => {
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
