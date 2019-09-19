const db = require('../db');

module.exports = (req, res)=> {

    const collection = db.get().collection('guests');
    const ObjectID = db.mongo.ObjectID;

    const findGuest = (queryObject) => {
        return new Promise((resolve, reject)=>{
            collection.find(queryObject).toArray((err, result)=>{
                if(err) {
                    reject({status: 500, error: 'Internal server error'})
                }
                else if(result.length === 0) {
                    reject({status: 404, error: 'Nie znaleziono gościa o podanym id'});
                }
                else {
                    resolve(result);
                }
            })
        }); 
    }
    const updateGuest = (queryObject, setObject) => {
        return new Promise((resolve, reject)=> {
            //MATCHED COUNT!!!!!!!!!!!!!!!!!!!!!!!!
            collection.updateOne(queryObject, setObject, err=> {
                if(err) {
                    reject({status: 500, error: 'Internal server error'});
                }
                else {
                    resolve({message : 'Guest updated successfully'})
                }            
            })

        })
    }
    const respondWithAnError = (res, status, message)=> {
        res.status(status);
        res.json({error: message})
    }
    if(typeof req.params.id === "string" && req.params.id !=="") {
       findGuest({ _id: ObjectID(req.params.id)}) //find the guest with id given in req.params
       .then(guest => {
            //Resolves, when there is such a guest
            //Checks if the first name and surname are valid
            //If they are, it resolves
            return new Promise((resolve, reject) => {
                let {firstName, surname, companionId} = req.body;
                if(companionId ===undefined) {
                    companionId = "";
                }
                //if name and surname were not specified in req.body, let them stay the same
                if(firstName === "" || firstName ==="undefined") {
                    firstName = guest[0].firstName;
                }
                if(surname === "" || surname ==="undefined") {
                    surname = guest[0].surname;
                }
                //if the name and surname suit the regex
                const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
                if(nameRegex.test(firstName) && nameRegex.test(surname)) {
                    resolve({firstName, surname, companionId, oldCompanionId : guest.companionId});
                }
                else {
                    reject({status: 400, error: 'Imię i nazwisko muszą składać się z liter i spacji'})
                }
            });
       })
       .then(dataToUpdate => {
           //next stage. Check if the user wants to change the companion. If doesn't, just update the guest.
            const {firstName, surname, companionId, oldCompanionId} = dataToUpdate;
            if(companionId === "") {
                //User doesn't want to change the companion
                updateGuest(
                    {
                        _id : ObjectID(req.param.id)
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
            else if(companionId === null) {
                //if req.body.companionId was set to null, remove the companion
                updateGuest(
                    {
                        _id : ObjectID(req.param.id)
                    }, 
                    {
                        $set: {
                            firstName, surname, companionId: ''
                        }
                    }
                )
                .then(() => {
                    //when the guest is updated, update the companion
                    updateGuest({
                        companionId : ObjectID(req.param.id)
                    },
                    {
                        $set: {
                            companionId : ''
                        }
                    })
                    .then(res => {
                        //success - process is done
                        res.json({message: res.message})
                    })
                    .catch(err=> {
                        respondWithAnError(res, err.status, err.error); 
                    })
                })
                .catch(err=> {
                    respondWithAnError(res, err.status, err.error);
                })
            }
            else {
                //Third option - companion id is changed
                //first - check out if there is such a companion
                findGuest({
                    _id: ObjectID(companionId)
                })
                .then(companion => {
                    //resolves, if there is such a companion
                    //update the guest
                    updateGuest({
                        _id : ObjectID(req.params.id)
                    },
                    {
                        $set: {
                            firstName, surname, companionId
                        }
                    })
                    .then(()=>{
                        //if the guest is updated successfully, update the companion
                        updateGuest({
                            _id : ObjectID(companionId)
                        },
                        {
                            $set: {
                                companionId : req.params.id
                            }
                        })
                        .then(()=> {
                            //check if companion had a companion, and update it
                            //guest may only bring one 
                            updateGuest({
                                companionId : ObjectID(oldCompanionId)
                            },
                            {
                                $set: {
                                    companionId : ''
                                }
                            })
                            .then(resp=>{
                                //success!
                                res.json({message: resp.message})
                            })
                            .catch(err => {
                                respondWithAnError(res, err.status, err.error);
                            });
                            
                        })
                        .catch(err => {
                            respondWithAnError(res, err.status, err.error);
                        });
                    })
                    .catch(err => {
                        respondWithAnError(res, err.status, err.error);
                    });
                })
                .catch(err => {
                    respondWithAnError(res, err.status, err.error);
                });
            }
       })
       .catch(err=>{
        respondWithAnError(res, err.status, err.error);
       })
    }
    else {
        respondWithAnError(res, 400, 'Nie podano id użytkownika');
    }
}