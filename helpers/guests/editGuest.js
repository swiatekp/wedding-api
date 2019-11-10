const db = require('../db');
const findGuest = require('./dbOperationsHelpers/findGuest');
const updateGuest = require('./dbOperationsHelpers/updateGuest');
const respondWithAnError = require('./respondWithAnError');
const tokenGenerator = require('./tokenGenerator');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    if (typeof req.params.id === "string" && req.params.id !== "") {
        findGuest({ _id: ObjectID(req.params.id) }) //find the guest with id given in req.params
            .then(guest => {
                //Resolves, when there is such a guest
                //Checks if the first name and surname are valid
                //If they are, it resolves
                return new Promise((resolve, reject) => {
                    let { firstName, surname, companionId } = req.body;
                    //if name and surname were not specified in req.body, let them stay the same
                    if (firstName === "" || firstName === "undefined") {
                        firstName = guest[0].firstName;
                    }
                    if (surname === "" || surname === "undefined") {
                        surname = guest[0].surname;
                    }
                    //if the name and surname suit the regex
                    const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
                    if (typeof firstName === "string" && typeof surname === "string") {
                        if (nameRegex.test(firstName) && nameRegex.test(surname)) {
                            if (ObjectID.isValid(companionId) || companionId === "" || companionId === null || companionId === undefined) {
                                resolve({ firstName, surname, companionId, oldCompanionId: guest[0].companionId.toString() });
                            }
                            else {
                                reject({ status: 400, error: 'ID osoby towarzyszącej jest nieprawidłowe.' });
                            }
                        }
                        else {
                            reject({ status: 400, error: 'Imię i nazwisko muszą składać się z liter i spacji' })
                        }
                    }
                    else {
                        reject({ status: 400, error: 'Imię i nazwisko powinny być ciągami znaków' });
                    }
                });
            })
            .then(dataToUpdate => {
                //next stage. Check if the user wants to change the companion. If doesn't, just update the guest.
                const { firstName, surname, companionId, oldCompanionId } = dataToUpdate;
                if (companionId === undefined) {
                    //User doesn't want to change the companion
                    updateGuest(
                        {
                            _id: ObjectID(req.params.id)
                        },
                        {
                            $set: {
                                firstName, surname
                            }
                        }
                    )
                        .then(message => {
                            res.json(message);
                        })
                        .catch(err => {
                            respondWithAnError(res, err.status, err.error);
                        })
                }
                else if (companionId === null || companionId === "") {
                    //if req.body.companionId was set to null or to an empty string, remove the companion
                    updateGuest(
                        {
                            _id: ObjectID(req.params.id)
                        },
                        {
                            $set: {
                                firstName, surname, companionId: '', token: tokenGenerator.getToken()
                            }
                        }
                    )
                        .then(resp => {
                            //when the guest is updated, update the companion
                            if (oldCompanionId !== "") {
                                updateGuest({
                                    companionId: ObjectID(req.params.id)
                                },
                                    {
                                        $set: {
                                            companionId: ''
                                        }
                                    })
                                    .then(resp => {
                                        //success - process is done
                                        res.json({ message: resp.message })
                                    })
                                    .catch(err => {
                                        respondWithAnError(res, err.status, err.error);
                                    })
                            }
                            else {
                                res.json({ message: resp.message });
                            }
                        })
                        .catch(err => {
                            respondWithAnError(res, err.status, err.error);
                        })
                }
                else {
                    //Third option - companion id is changed
                    //first - check out if there is such companion
                    findGuest({
                        _id: ObjectID(companionId)
                    })
                        .then(resp => {
                            //resolves, if there is such a companion
                            //update the guest
                            const token = tokenGenerator.getToken();
                            updateGuest({
                                _id: ObjectID(req.params.id)
                            },
                                {
                                    $set: {
                                        firstName, surname, companionId: ObjectID(companionId), token
                                    }
                                })
                                .then(resp => {
                                    //if the guest is updated successfully, update the companion
                                    updateGuest({
                                        _id: ObjectID(companionId)
                                    },
                                        {
                                            $set: {
                                                companionId: ObjectID(req.params.id),
                                                token
                                            }
                                        })
                                        .then(resp => {
                                            //update the old companion
                                            //If the new companion id is the same like old companion id, do nothing
                                            console.log(`Old companion: ${oldCompanionId}, new companion: ${companionId}`);
                                            if (oldCompanionId !== companionId && oldCompanionId !== "") {
                                                updateGuest({
                                                    _id: ObjectID(oldCompanionId)
                                                },
                                                    {
                                                        $set: {
                                                            companionId: ''
                                                        }
                                                    }, true)
                                                    .then(resp => {
                                                        console.log('Linia 148')
                                                        return new Promise((resolve, reject) => {
                                                            resolve(resp);
                                                        });
                                                    })
                                                    .catch(err => {
                                                        console.log('Błąd')
                                                        respondWithAnError(res, err.status, err.error);
                                                        return new Promise((resolve, reject) => {
                                                            reject(error);
                                                        });
                                                    });
                                            }
                                            else {
                                                return new Promise((resolve, reject) => {
                                                    resolve(resp);
                                                });
                                            }
                                        })
                                        .then(() => {
                                            console.log('Final step');
                                            //Final step - check if the new companion had a companion and update it
                                            //Every guest can bring only one companion
                                            //The new companion is already added to our guest, so the query has to ommit it
                                            updateGuest({
                                                companionId: ObjectID(companionId),
                                                _id: { $not: { $eq: ObjectID(req.params.id) } }
                                            },
                                                {
                                                    $set: {
                                                        companionId: ''
                                                    }
                                                }, true)
                                                .then(resp => {
                                                    res.json({ message: resp.message })
                                                })
                                                .catch(err => {
                                                    respondWithAnError(res, err.status, err.error);
                                                });
                                        })
                                    // .catch(err => {
                                    //     console.log(err);
                                    //     respondWithAnError(res, err.status, err.error);
                                    // });
                                })
                                .catch(err => {
                                    // console.log(err);
                                    respondWithAnError(res, err.status, err.error);
                                });
                        })
                        .catch(err => {
                            respondWithAnError(res, err.status, err.error);
                        });
                }
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            })
    }
    else {
        respondWithAnError(res, 400, 'Nie podano id użytkownika');
    }
}