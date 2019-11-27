const db = require('../../db');
module.exports = queryObject => {
    const collection = db.get().collection('approach-tips');
    return new Promise((resolve, reject) => {
        collection.deleteOne(queryObject, (err, tip) => {
            if (err) {
                reject({ status: 500, error: 'Internal server error' });
            }
            else if (tip.deletedCount === 0) {
                reject({ status: 404, error: 'Nie znaleziono wpisu' });
            }
            else {
                resolve({ message: 'Wpis usunięty pomyślnie' });
            }
        })
    });
}