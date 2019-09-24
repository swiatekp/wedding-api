const db = require('../../db');
module.exports = updateGuest = (queryObject, setObject, dontRejectIfNotFound = false) => {
    const collection = db.get().collection('guests');
    return new Promise((resolve, reject) => {
        collection.updateOne(queryObject, setObject, (err, result) => {
            if (err) {
                reject({ status: 500, error: 'Internal server error' });
            }
            else if (result.matchedCount === 0 && dontRejectIfNotFound === false) {
                reject({ status: 404, error: 'Not found' });
            }
            else {
                resolve({ message: 'Udało się' });
            }
        })
    })
}