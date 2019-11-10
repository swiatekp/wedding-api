const db = require('./db');
const respondWithAnError = require('./guests/respondWithAnError');
const crypto = require('crypto');

module.exports = (req, res) => {
    const collection = db.get().collection('admins');
    const { login, password } = req.body;
    if (typeof login === "string" &&
        typeof password === "string" &&
        login !== "" &&
        password !== ""
    ) {
        collection.find({ login }).toArray((err, result) => {
            if (err) {
                respondWithAnError(res, 500, "Błąd serwera");
            }
            else if (result.length === 0) {
                respondWithAnError(res, 404, "Błędny login");
            }
            else {
                const passwordHashed = crypto.createHash('sha256').update(password).digest('hex');

                if (result[0].password === passwordHashed) {
                    res.json({ isPasswordCorrect: true });
                }
                else {
                    res.json({ isPasswordCorrect: false });
                }
            }
        })
    }
    else {
        respondWithAnError(res, 400, "Bad request");
    }
}