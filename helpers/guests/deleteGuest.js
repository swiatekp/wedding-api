const db = require('../db');
const updateGuest = require('./updateGuest');
const respondWithAnError = require('./respondWithAnError');

const deleteGuest = queryObject => {
    const collection = db.get().collection('guests');
    return new Promise((resolve, reject) => {
        collection.deleteOne(queryObject, (err, guest) => {
            console.log(guest);
            if (err) {
                reject({ status: 500, error: 'Internal server error' });
            }
            else if (guest.deletedCount === 0) {
                reject({ status: 404, error: 'Nie znaleziono gościa' });
            }
            else {
                resolve({ message: 'Gość usunięty pomyślnie' });
            }
        })
    });
}

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