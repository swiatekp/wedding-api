const respondWithAnError = require('../guests/respondWithAnError');
const findTips = require('./dbOperationsHelpers/findTips');
const db = require('../db');
module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;

    if (ObjectID.isValid(id)) {
        findTips({
            _id: ObjectID(id)
        })
            .then(result => {
                res.json(result[0]);
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            });
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID')
    }
}