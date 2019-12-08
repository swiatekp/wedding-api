const respondWithAnError = require('../guests/respondWithAnError');
const db = require('../db');
const updateTips = require('./dbOperationsHelpers/updateTips');
const findTips = require('./dbOperationsHelpers/findTips');

//moves the tip down the order by updating its orderIndex

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;

    if (ObjectID.isValid(id)) {
        const idWrapped = ObjectID(id);
        //get the tip that we want to move
        findTips({
            _id: idWrapped
        })
            .then(tipToMove => {
                const prevOrderIndex = tipToMove[0].orderIndex;
                const category = tipToMove[0].category;
                //get all the tips that belong to our category
                findTips({
                    category
                })
                    .then(tipsFromTheCategory => {
                        const lastPossibleIndex = tipsFromTheCategory.length - 1;
                        //check whether the tip is last on the list
                        if (prevOrderIndex < lastPossibleIndex) {
                            //edit our tips' successor
                            updateTips({
                                orderIndex: prevOrderIndex + 1,
                                category
                            },
                                {
                                    $inc: {
                                        orderIndex: -1
                                    }
                                })
                                .then(() => {
                                    //successor has been edited successfully - now edit our tip
                                    updateTips({
                                        _id: idWrapped
                                    },
                                        {
                                            $inc: {
                                                orderIndex: +1
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
                                    respondWithAnError(res, err.status, err.error);
                                })

                        }
                        else {
                            respondWithAnError(res, 400, "Próbujesz przesunąć w dół element, który jest już na końcu listy.");
                        }
                    })
                    .catch(err => {
                        respondWithAnError(res, err.status, err.error);
                    })
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            })
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID');
    }
}