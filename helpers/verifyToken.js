const isTokenOnTheBlackList = require('./isTokenOnTheBlackList');
const respondWithAnError = require('./guests/respondWithAnError');

exports.verifyToken = (req, res, next) => {
    //bearer can be passed in two ways
    //first - by header (fetch etc)
    //first - by session (to log in to the admins' panel)
    // if (typeof req.headers['authorization'] !== "undefined") {
    //     const bearerHeader = req.headers['authorization'];
    //     // Format of the token:
    //     // Authorization: Bearer <access_token>
    //     // Split at the space to get the token out of the string

    //     const bearer = bearerHeader.split(' ');
    //     //Get token from the array
    //     const bearerToken = bearer[1];

    //     //Check, if the token is on the black list

    //     isTokenOnTheBlackList(bearerToken)
    //         .then(result => {
    //             //if result is true, token is on the black list
    //             //if false - set the token and go next();
    //             if (result === false) {
    //                 //set the token
    //                 req.token = bearerToken;
    //                 //Next middleware
    //                 next();
    //             }
    //             else {
    //                 respondWithAnError(res, 403, "Brak dostępu")
    //             }
    //         })
    //         .catch(err => {
    //             respondWithAnError(res, err.status, err.error);
    //         })
    // }

    if (req.session.token) {
        isTokenOnTheBlackList(req.session.token)
            .then(result => {
                //if result is true, token is on the black list
                //if false - set the token and go next();
                if (result === false) {
                    //set the token
                    req.token = req.session.token;
                    //Next middleware
                    next();
                }
                else {
                    respondWithAnError(res, 403, "Brak dostępu")
                }
            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            })
    }
    else {
        if (req.originalUrl.path === '/login') {
            res.redirect('/loginform');
        }
        else {
            res.status(403);
            res.json({ error: 'Brak dostępu' });
        }
    }
}