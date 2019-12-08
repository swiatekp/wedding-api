const fs = require('fs');

const updateTips = require('./dbOperationsHelpers/updateTips');
const findTips = require('./dbOperationsHelpers/findTips');
const respondWithAnError = require('../guests/respondWithAnError');

const db = require('../db.js');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;

    if (ObjectID.isValid(id)) {
        const idWrapped = ObjectID(id);

        findTips({ _id: idWrapped })
            .then(tip => {
                if (tip[0].filename) {
                    fs.unlink(`./uploads/${tip[0].filename}`, err => {
                        if (err) {
                            respondWithAnError(res, 500, err.message);
                        }
                        else {
                            //file has been removed successfully, now update the database
                            updateTips(
                                {
                                    _id: idWrapped
                                },
                                {
                                    $set: {
                                        filename: null
                                    }
                                }
                            )
                                .then(resp => {
                                    res.json(resp);
                                })
                                .catch(err => {
                                    respondWithAnError(res, err.status, err.message);
                                })
                        }
                    });
                }
                else {
                    respondWithAnError(res, 404, 'Ta wskazówka nie posiada ilustracji');
                }
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
                console.log('Tu jestem');
            })
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID');
    }
}