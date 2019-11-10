const db = require('./db');
const respondWithAnError = require('./guests/respondWithAnError');
const crypto = require('crypto');

module.exports = (req, res) => {
    const collection = db.get().collection('admins');
    const { login, prevPassword, newPassword } = req.body;
    if (typeof login === "string" &&
        typeof prevPassword === "string" &&
        typeof newPassword === "string" &&
        login !== "" &&
        prevPassword !== "" &&
        newPassword !== ""
    ) {
        if (newPassword.length >= 6) {
            collection.find({ login }).toArray((err, result) => {
                if (err) {
                    respondWithAnError(res, 500, "Błąd serwera");
                }
                else if (result.length === 0) {
                    respondWithAnError(res, 404, "Błędny login");
                }
                else {
                    const prevPasswordHashed = crypto.createHash('sha256').update(prevPassword).digest('hex');
                    const newPasswordHashed = crypto.createHash('sha256').update(newPassword).digest('hex');
                    if (result[0].password === prevPasswordHashed) {
                        collection.updateOne({
                            login
                        },
                            {
                                $set: {
                                    password: newPasswordHashed
                                }
                            }, (err, result) => {
                                if (err) {
                                    respondWithAnError(res, 500, "Błąd serwera");
                                }
                                else if (result.matchedCount === 0) {
                                    respondWithAnError(res, 404, "Nie udało się zmienić hasła");
                                }
                                else {
                                    res.json({ message: 'Udało się' });
                                }
                            })
                    }
                    else {
                        respondWithAnError(res, 400, "Podano nieprawidłowe stare hasło");
                    }
                }
            })
        }
        else {
            respondWithAnError(res, 400, "Hasło powinno składać się z co najmniej 6 znaków");
        }
    }
    else {
        respondWithAnError(res, 400, "Należy podać login, stare hasło i nowe hasło");
    }
}