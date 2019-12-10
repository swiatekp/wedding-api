const db = require('./db');

module.exports = (req, res) => {
    const collection = db.get().collection('token-blacklist');
    if (req.token) {
        collection.insertOne({ token: req.token }, err => {
            if (err) {
                res.status('500');
                res.json({ message: 'Błąd serwera' });
            }
            else {
                res.json({ message: 'Wylogowano pomyślnie' });
            }
        })
    }
    else {
        res.status('403');
        res.json({ message: 'Brak dostępu' });
    }
}