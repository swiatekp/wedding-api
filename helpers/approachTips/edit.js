const updateTips = require('./dbOperationsHelpers/updateTips');
const findTips = require('./dbOperationsHelpers/findTips');
const respondWithAnError = require('../guests/respondWithAnError');
const correctOrderIndexes = require('./correctOrderIndexes');
const db = require('../db.js');

module.exports = (req, res) => {
    let { category, content } = req.body;
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;
    const contentRegex = /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{5,255}$/igm;

    if (ObjectID.isValid(id)) {
        const idWrapped = ObjectID(id);
        findTips({ _id: idWrapped })
            .then(prevTip => {
                //if category is not valid, use the previous value instead
                if (category !== "1" && category !== "2") {
                    category = prevTip[0].category;
                }
                //if content is undefined, null, or an empty string, use the previous value instead
                if (content === undefined || content === null || content === "") {
                    content = prevTip[0].content;
                }

                let orderIndex = prevTip[0].orderIndex;

                if (category !== prevTip[0].category) {
                    //if the category will change, move the tip to the bottom of the list
                    orderIndex = 999999999;
                }

                if (contentRegex.test(content)) {
                    updateTips(
                        {
                            _id: idWrapped
                        },
                        {
                            $set: {
                                category, content, orderIndex
                            }
                        }
                    )
                        .then(result => {
                            if (category !== prevTip[0].category) {
                                correctOrderIndexes(req, res);
                            }
                            res.json(result);
                        })
                        .catch(err => {
                            respondWithAnError(res, err.status, err.error);
                        })
                }
                else {
                    respondWithAnError(res, 400, 'Nieprawidłowa treść wskazówki');
                }
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            });
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID');
    }
}

