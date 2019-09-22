const db = require('../db');
const findGuest = require('./findGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const { firstName, surname, token } = req.body;
    if (typeof firstName === "string" && typeof surname === "string" && typeof token === "string") {
        findGuest({
            firstName, surname
        })
            .then(guest => {
                //if guest passed the right token - access allowed
                if (guest[0].token === token) {
                    res.json(guest[0]);
                }
                else {
                    respondWithAnError(res, 404, 'Nieprawidłowy token');
                }
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            })
    }
    else {
        console.log(firstName);
        console.log(surname);
        console.log(token);
        respondWithAnError(res, 400, "Nieprawidłowe zapytanie");
    }
}