const db = require('../../db');
module.exports = queryObject => {
    const collection = db.get().collection('approach-tips');
    return new Promise((resolve, reject) => {
        collection.find(queryObject).toArray((err, result) => {
            if (err) {
                reject({ status: 500, error: 'Internal server error' })
            }
            else if (result.length === 0) {
                reject({ status: 404, error: 'Brak wskazówek' });
            }
            else {
                resolve(result);
            }
        })
    });
}