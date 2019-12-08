const respondWithAnError = require('../guests/respondWithAnError');
const db = require('../db');
const updateTips = require('./dbOperationsHelpers/updateTips');
const findTips = require('./dbOperationsHelpers/findTips');

//moves the tip up the order by updating its orderIndex

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;

    if (ObjectID.isValid(id)) {
        const idWrapped = ObjectID(id);
        findTips({
            _id: idWrapped
        })
            .then(tipToMove => {
                // check if our tip is not on the top of the list
                const prevOrderIndex = tipToMove[0].orderIndex;
                if (prevOrderIndex > 0) {
                    //first - update our tip's precedessor (they swap positons);
                    updateTips({
                        orderIndex: prevOrderIndex - 1,
                        category: tipToMove[0].category
                    },
                        {
                            $inc: {
                                orderIndex: 1
                            }
                        })
                        .then(() => {
                            //When the precedessor is updated successfully, update our tip
                            updateTips({
                                _id: idWrapped
                            },
                                {
                                    $inc: {
                                        orderIndex: -1
                                    }
                                })
                                .then(result => {
                                    res.json(result);

                                })
                                .catch(err => {
                                    respondWithAnError(res, err.status, err.message);
                                });

                        })
                        .catch(err => {
                            respondWithAnError(res, err.status, "Problem ze znalezieniem poprzednika");
                        })
                }
                else {
                    respondWithAnError(res, 400, "Próbujesz przesunąć w górę element, który jest już na początku listy");
                }
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            })
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID');
    }
}