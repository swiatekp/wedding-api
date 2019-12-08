const respondWithAnError = require('../guests/respondWithAnError');
const db = require('../db.js');
const updateTips = require('./dbOperationsHelpers/updateTips');
const findTips = require('./dbOperationsHelpers/findTips');

module.exports = (req, res) => {
    //Corrects the order indexes, so the sequence is like: 0, 1, 2, 3
    //neccessary after moving a tip from one category to another

    const ObjectID = db.mongo.ObjectID;

    //Wedding tips first
    findTips({ category: "1" })
        .then(tips => {
            tips.forEach((tip, i) => {
                updateTips(
                    { _id: ObjectID(tip._id) },
                    {
                        $set: {
                            orderIndex: i
                        }
                    }
                )
                    .catch((err) => {
                        console.log(err);
                    })
            });
        })
        .catch(err => {
            respondWithAnError(res, err.status, err.error);
        });

    //And now party tips
    findTips({ category: "2" })
        .then(tips => {
            tips.forEach((tip, i) => {
                updateTips(
                    { _id: ObjectID(tip._id) },
                    {
                        $set: {
                            orderIndex: i
                        }
                    }
                )
                    .catch((err) => {
                        console.log(err);
                    })
            });
        })
        .catch(err => {
            respondWithAnError(res, err.status, err.error);
        })
}