const findGuest = require('./dbOperationsHelpers/findGuest');
const updateGuest = require('./dbOperationsHelpers/updateGuest');
const respondWithAnError = require('./respondWithAnError');
const db = require('../db');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const _id = req.params.id;
    const { token, firstName, surname } = req.body;
    const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
    if (ObjectID.isValid(_id)) {
        if (typeof token === "string" && token.length === 6) {
            if (nameRegex.test(firstName) && nameRegex.test(surname)) {
                findGuest({ _id: ObjectID(_id) })
                    .then(guest => {
                        const companionId = guest[0].companionId;
                        const tokenFromTheBase = guest[0].token;

                        if (token === tokenFromTheBase) {
                            updateGuest({ _id: ObjectID(companionId) },
                                {
                                    $set: {
                                        firstName, surname
                                    }
                                })
                                .then(resp => {
                                    res.json(resp);
                                })
                                .catch(err => {
                                    respondWithAnError(res, err.status, err.error);
                                })
                        }
                        else {
                            respondWithAnError(res, 403, "Nieprawidłowy token");
                        }
                    })
                    .catch(err => {
                        respondWithAnError(res, err.status, err.error);
                    })
            }
            else {
                respondWithAnError(res, 400, "Nieprawidłowe imię lub nazwisko");
            }
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowy token")
        }
    }
    else {
        respondWithAnError(res, 400, "Nieprawidłowe ID");
    }
}