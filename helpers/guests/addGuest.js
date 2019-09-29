const db = require('../db');
const tokenGenerator = require('./tokenGenerator');
const findGuest = require('./dbOperationsHelpers/findGuest');
const updateGuest = require('./dbOperationsHelpers/updateGuest');
const addGuest = require('./dbOperationsHelpers/addGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const { firstName, surname, companionId } = req.body;
    const ObjectID = db.mongo.ObjectID;
    if (typeof firstName === "string" && firstName !== "" && typeof surname === "string" && surname !== "") {
        const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
        if (nameRegex.test(firstName) && nameRegex.test(surname)) {
            const token = tokenGenerator.getToken();
            if (companionId !== "" && companionId !== undefined) {
                if (ObjectID.isValid(companionId)) {
                    //Check if companion even exists
                    findGuest({
                        _id: ObjectID(companionId)
                    })
                        .then(companionFindGuestOutput => {
                            //Add the main guest
                            addGuest({
                                firstName, surname,
                                confirmed: "",
                                message: "",
                                companionId: ObjectID(companionId),
                                token: companionFindGuestOutput[0].token //use companions' token, so both guests have the same one
                            })
                                .then(resp => {
                                    const insertedId = resp.insertedId;
                                    //Update the companion
                                    updateGuest(
                                        {
                                            _id: ObjectID(companionId)
                                        },
                                        {
                                            $set: {
                                                companionId: ObjectID(insertedId)
                                            }
                                        }
                                    )
                                        .then(() => {
                                            //dotąd wszystko działa
                                            //update companions' companion
                                            updateGuest({
                                                companionId: ObjectID(companionId),
                                                _id: { $not: { $eq: insertedId } }

                                            },
                                                {
                                                    $set: {
                                                        companionId: '',
                                                        token: tokenGenerator.getToken()
                                                    }
                                                }, true)
                                                .then(() => {
                                                    res.json({ message: 'Gość został dodany pomyślnie' });
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
                                    respondWithAnError(res, err.status, err.error);
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            respondWithAnError(res, err.status, err.error);
                        })
                }
                else {
                    respondWithAnError(res, 400, 'Podano nieprawidłowe id osoby towarzyszącej');
                }
            }
            else {
                //Guest comes without companion
                addGuest({
                    firstName, surname,
                    confirmed: "",
                    message: "",
                    companionId: '',
                    token
                })
                    .then(() => {
                        //Dotąd wszystko działa
                        res.json({ message: 'Gość został dodany pomyślnie' });
                    })
                    .catch(err => {
                        respondWithAnError(res, err.status, err.error);
                    })
            }
        }
        else {
            respondWithAnError(res, 400, "Imię i nazwisko powinny składać się z liter i spacji");
        }
    }
    else {
        respondWithAnError(res, 400, "Należy podać prawidłowe imię i nazwisko");
    }
}