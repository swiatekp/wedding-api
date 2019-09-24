const db = require('../db');
const findGuest = require('./dbOperationsHelpers/findGuest');
const updateGuest = require('./dbOperationsHelpers/updateGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const { id } = req.params;
    const { confirmed, token } = req.body;
    if (ObjectID.isValid(id)) {
        if (typeof confirmed === "boolean") {
            if (typeof token === "string" && token !== "") {
                findGuest({ _id: ObjectID(id) })
                    .then(guests => {
                        if (guests[0].token === token) {
                            updateGuest(
                                { _id: ObjectID(id) },
                                {
                                    $set: {
                                        confirmed
                                    }
                                }
                            )
                                .then(() => {
                                    res.json({ message: 'Potwierdzono przybycie gościa' });
                                })
                                .catch(err => {
                                    respondWithAnError(res, err.status, err.message);
                                });
                        }
                        else {
                            respondWithAnError(res, 403, "Nieprawidłowy token");
                        }
                    })
                    .catch(err => {
                        respondWithAnError(res, err.status, err.error);
                    });
            }
            else {
                respondWithAnError(res, 400, "Nie podano tokenu");
            }
        }
        else {
            respondWithAnError(res, 400, "Zawartość req.body.confirmed powinna być typu boolean");
        }
    }
    else {
        respondWithAnError(res, 400, "Nie podano albo wprowadzono nieprawidłowe id");
    }
}