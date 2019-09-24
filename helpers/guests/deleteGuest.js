const db = require('../db');
const updateGuest = require('./dbOperationsHelpers/updateGuest');
const deleteGuest = require('./dbOperationsHelpers/deleteGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const { id } = req.params;
    if (id !== "" && id !== undefined) {
        if (typeof id === "string" && id !== "") {
            const ObjectID = db.mongo.ObjectID;
            if (ObjectID.isValid(id)) {
                //delete guest
                deleteGuest(
                    {
                        _id: ObjectID(id)
                    }
                )
                    .then(() => {
                        //update guests' companion
                        updateGuest({
                            companionId: ObjectID(id)
                        },
                            {
                                $set: {
                                    companionId: ''
                                }
                            }, true)
                            .then(() => {
                                res.json({ message: 'Usunięto gościa' });
                            })
                            .catch(err => {
                                respondWithAnError(res, err.status, err.error);
                            })
                    })
                    .catch(err => {
                        respondWithAnError(res, err.status, err.error);
                    });
            }
            else {
                respondWithAnError(res, 400, "Podano nieprawidłowe id");
            }
        }
        else {
            respondWithAnError(res, 400, "Id powinno być niepustym stringiem");
        }
    }
    else {
        respondWithAnError(res, 400, "Nie podano id");
    }
}