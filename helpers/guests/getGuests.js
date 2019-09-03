const db = require('../db.js');
module.exports = (req, res) => {
    db.get().collection('guests').find({}).toArray((err, guests) => {
        if (err) {
            res.status(500);
            res.json({ error: 'Internal server error' });
        }
        else if (guests.length === 0) {
            res.status(404);
            res.json({ error: 'Guests collection is empty' });
        }
        else {
            const guestsToSend = guests.map(guest => {
                const { _id, firstName, surname, confirmed, message, companionId } = guest;
                guestToSend = {
                    _id,
                    firstName,
                    surname,
                    confirmed,
                    message,
                    companionId
                }
                return guestToSend;
            })
            res.json(guestsToSend);
        }
    })
}