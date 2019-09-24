const db = require('../db');
const updateGuest = require('./dbOperationsHelpers/updateGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const { id } = req.params;
    const { confirmed } = req.body;
    if (ObjectID.isValid(id)) {
        if (typeof confirmed == "boolean") {
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
            respondWithAnError(res, 400, "Zawartość req.body.confirmed powinna być typu boolean");
        }
    }
    else {
        respondWithAnError(res, 400, "Nie podano albo wprowadzono nieprawidłowe id");
    }
}