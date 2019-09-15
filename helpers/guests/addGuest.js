const db = require('../db');
const tokenGenerator = require('./tokenGenerator');

module.exports = (req, res) => {
    const { firstName, surname, companionId } = req.body;
    if (firstName !== "" && surname !== "" && firstName !== undefined && surname !== undefined) {
        const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
        if (nameRegex.test(firstName) && nameRegex.test(surname)) {
            const token = tokenGenerator.getToken();
            if (companionId !== "" && companionId !== undefined) {
                //check if companion with the given Id exists
                db.get().collection('guests').find({ _id: db.mongo.ObjectID(companionId) }).toArray((err, guests) => {
                    if (err) {
                        res.status(500);
                        res.json({ error: "Internal server error" });
                    }
                    else {
                        if (guests.length !== 0) {
                            //Remove companion from all other guests, so every guest may only have one companion
                            db.get().collection('guests').updateMany({
                                companionId: db.mongo.ObjectID(companionId)
                            },
                                {
                                    $set: {
                                        companionId: ''
                                    },
                                },
                                err => {
                                    if (err) {
                                        res.status(500);
                                        res.json("Internal server error");
                                    }
                                    else {
                                        //Insert new guest
                                        db.get().collection('guests').insertOne({
                                            firstName, surname,
                                            confirmed: false,
                                            message: "",
                                            companionId: db.mongo.ObjectID(companionId),
                                            token
                                        }, (err, guest) => {
                                            if (err) {
                                                res.status(500);
                                                res.json("Internal server error");
                                            }
                                            else {

                                                if (err) {
                                                    res.status(500);
                                                    res.json('Internal server error');
                                                }
                                                else {
                                                    //Find guests' companion and update its "companion" field
                                                    //Companions share their confirmation-tokens, so the companions' token is updated
                                                    db.get().collection('guests').updateOne({
                                                        _id: db.mongo.ObjectID(companionId)
                                                    },
                                                        {
                                                            $set: {
                                                                companionId: db.mongo.ObjectID(guest.insertedId),
                                                                token
                                                            }
                                                        },
                                                        err => {
                                                            if (err) {
                                                                res.status(500);
                                                                res.json('Internal server error');
                                                            }
                                                            else {
                                                                res.json({ message: "Gość został dodany pomyślnie. Token potwierdzający przybycie został zaktualizowany." });
                                                            }
                                                        });
                                                }

                                            }
                                        });

                                    }
                                });

                        }
                        else {
                            res.status(404);
                            res.json({ error: "Companion not found" });
                        }
                    }
                });
            }
            else {
                //If there is no companion id specified, insert guest without companion
                db.get().collection('guests').insertOne({
                    firstName, surname,
                    confirmed: false,
                    message: "",
                    companionId: "",
                    token
                }, err=>{
                    if(err) {
                        res.status(500);
                        res.json({error: 'Internal server error'});
                    }
                    else {
                        res.json({error : 'User has been added successfully'});
                    }
                });
            }
        }
        else {
            res.status(400);
            res.json({ error: "Name and surname should consist of letters and spaces only. Max length is 30 characters." });
        }
    }
    else {
        res.status(400);
        res.json({ error: "The request should contain at least first name and surname" });
    }
}