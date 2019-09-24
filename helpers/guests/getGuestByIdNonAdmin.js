const db = require('../db');
const findGuest = require('./dbOperationsHelpers/findGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const { token } = req.body;
    const { id } = req.params;

    if (ObjectID.isValid(id)) {
        if (typeof token === "string" && token !== "") {
            findGuest({ _id: ObjectID(req.params.id) })
                .then(result => {
                    if (result[0].token === token) {
                        res.json(result[0]);
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
        respondWithAnError(res, 400, "Nieprawidłowe id gościa");
    }
}