const db = require('../db');
const findGuest = require('./dbOperationsHelpers/findGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;

    if (ObjectID.isValid(req.params.id)) {
        findGuest({ _id: ObjectID(req.params.id) })
            .then(result => {
                res.json(result[0]);
            })
            .catch(err => {
                console.log(err);
                respondWithAnError(res, err.status, err.error);
            });
    }
    else {
        res.status(400);
        res.json({ error: 'Nieprawidłowe ID gościa' });
    }
}