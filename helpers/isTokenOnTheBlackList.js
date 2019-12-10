const db = require('./db');

module.exports = token => {
    //rejects, if an error occurs
    //resolves with false, if token is not on the list
    //resolves with true, if token is on the list
    const collection = db.get().collection('token-blacklist');
    return new Promise((resolve, reject) => {
        collection.find({ token }).toArray((err, result) => {
            if (err) {
                reject({ status: 500, error: 'Problem przy przeszukiwaniu bazy tokenów' })
            }
            else if (result.length === 0) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        })
    });
}
