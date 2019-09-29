const db = require('../../db');
module.exports = queryObject => {
    const collection = db.get().collection('guests');
    return new Promise((resolve, reject) => {
        collection.insertOne(queryObject, (err, guest) => {
            if (err) {
                reject({ status: 500, error: 'Internal server error' });
            }
            else {
                resolve({ message: 'Gość dodany pomyślnie', insertedId: guest.insertedId });
            }
        })
    });
}