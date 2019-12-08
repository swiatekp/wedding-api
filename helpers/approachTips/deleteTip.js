const fs = require('fs');
const respondWithAnError = require('../guests/respondWithAnError');
const db = require('../db');
const removeTip = require('./dbOperationsHelpers/removeTip');
const findTips = require('./dbOperationsHelpers/findTips');
const updateTips = require('./dbOperationsHelpers/updateTips');

module.exports = (req, res) => {
    const collection = db.get().collection('approach-tips');
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;

    if (ObjectID.isValid(id)) {
        findTips({ _id: ObjectID(id) })
            .then(result => {
                const removedTipFilename = result[0].filename;
                const removedTipCategory = result[0].category;
                const removedTipOrderIndex = result[0].orderIndex;

                removeTip({ _id: ObjectID(id) })
                    .then(resp => {
                        if (removedTipFilename) {
                            fs.unlink(`./uploads/${removedTipFilename}`, err => {
                                return null;
                            });
                        }

                        //after tip removal, new orderIndex should be assigned to the records, with orderIndex higher than in the removed tip
                        updateTips(
                            {
                                category: removedTipCategory,
                                orderIndex: { $gt: removedTipOrderIndex }
                            },
                            {
                                $inc: {
                                    orderIndex: -1
                                }
                            },
                            true
                        ).then(result => {
                            res.json(result);
                        })
                            .catch(err => {
                                respondWithAnError(res, err.status, err.error);
                            })
                    })
                    .catch(err => {
                        respondWithAnError(res, err.status, err.error);
                    })
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error)
            });
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID');
    }
}