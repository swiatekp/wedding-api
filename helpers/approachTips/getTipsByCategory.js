const respondWithAnError = require('../guests/respondWithAnError');
const findTips = require('./dbOperationsHelpers/findTips');

module.exports = (req, res) => {
    const { category } = req.params;
    if (category !== "1" && category !== "2") {
        respondWithAnError(res, 400, 'Nieprawidłowa kategoria');
    }
    else {
        findTips({
            category
        })
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            });
    }
}