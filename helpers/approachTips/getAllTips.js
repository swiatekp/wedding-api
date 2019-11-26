const respondWithAnError = require('../guests/respondWithAnError');
const findTips = require('./dbOperationsHelpers/findTips');

module.exports = (req, res) => {
    findTips({})
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            respondWithAnError(res, err.status, err.error);
        });
}