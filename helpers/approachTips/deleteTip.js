const respondWithAnError = require('../guests/respondWithAnError');
const db = require('../db');
const removeTip = require('./dbOperationsHelpers/removeTip');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;
    if (ObjectID.isValid(id)) {
        removeTip({ _id: ObjectID(id) })
            .then(resp => {
                res.json(resp);
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            })
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID');
    }
}