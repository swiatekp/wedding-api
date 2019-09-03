const db = require('../db');

module.exports = (req, res) => {
    const { firstName, surname, companionId } = req.body;
    if (firstName !== "" && surname !== "" && firstName !== undefined && surname !== undefined) {
        const nameRegex = /^[a-zęóąśłżźćń ]{2,30}$/i;
        if (nameRegex.test(firstName) && nameRegex.test(surname)) {
            if (companionId !== "" && companionId !== undefined) {
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
                                            companionId: db.mongo.ObjectID(companionId)
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
                                                    db.get().collection('guests').updateOne({
                                                        _id: db.mongo.ObjectID(companionId)
                                                    },
                                                        {
                                                            $set: {
                                                                companionId: db.mongo.ObjectID(guest.insertedId)
                                                            }
                                                        },
                                                        err => {
                                                            if (err) {
                                                                res.status(500);
                                                                res.json('Internal server error');
                                                            }
                                                            else {
                                                                res.json({ message: "Guest added successfully" });
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
                    companionId: ""
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