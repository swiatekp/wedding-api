const findGuest = require('./dbOperationsHelpers/findGuest');
const respondWithAnError = require('./respondWithAnError');

module.exports = (req, res) => {
    const { firstName, surname, token } = req.body;
    if (firstName && surname && token) {
        const firstNameRegex = new RegExp(`^${firstName}$`, 'i'); //A trick to make the search case-insensitive
        const surnameRegex = new RegExp(`^${surname}$`, 'i');

        findGuest({
            firstName: { $regex: firstNameRegex },
            surname: { $regex: surnameRegex }
        })
            .then(result => {
                if (result.length > 0) {
                    if (result[0].token === token) {
                        res.json(result[0]);
                    }
                    else {
                        respondWithAnError(res, 400, 'Nieprawidłowy token')
                    }
                }
                else {
                    respondWithAnError(res, 404, 'Nie ma takiego gościa');
                }
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            });
    }
    else {
        respondWithAnError(res, 400, "Nieprawidłowe zapytanie");
    }
}