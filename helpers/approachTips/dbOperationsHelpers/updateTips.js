const db = require('../../db');

module.exports = (queryObject, updateObject, dontRejectIfNotFound = false) => {
    const collection = db.get().collection('approach-tips');
    return new Promise((resolve, reject) => {
        collection.updateMany(queryObject, updateObject,
            (err, result) => {
                if (err) {
                    reject({ status: 500, error: 'Internal server error' });
                }
                else if (result.matchedCount === 0 && dontRejectIfNotFound === false) {
                    reject({ status: 404, error: 'Brak wskazówek' });
                }
                else {
                    resolve({ message: 'Udało się' });
                }
            }
        );
    });
}