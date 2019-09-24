const findGuest = require('./dbOperationsHelpers/findGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {

    findGuest({})
        .then(guests => {
            if (guests.length === 0) {
                res.status(404);
                res.json({ error: 'Brak gości' });
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
        .catch(err => {
            respondWithAnError(res, err.status, err.error);
        });
}