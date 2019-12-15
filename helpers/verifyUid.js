const respondWithAnError = require('./guests/respondWithAnError');
const db = require('./db');

exports.verifyUid = (req, res, next) => {
    const ObjectID = db.mongo.ObjectID;
    if (req.session.uid) {
        if (ObjectID.isValid(req.session.uid)) {
            db.get().collection('admins').find({ _id: ObjectID(req.session.uid) }).toArray((err, admin) => {
                if (err) {
                    respondWithAnError(res, 403, 'Błąd autoryzacji');
                }
                else {
                    if (admin.length > 0) {
                        //if there is such user, go next()
                        next();
                    }
                    else {
                        respondWithAnError(res, 403, 'Błąd autoryzacji');
                    }
                }
            });
        }
        else {
            respondWithAnError(res, 403, 'Błąd autoryzacji');
        }
    }
    else {
        if (req.originalUrl.path === '/login' || req.originalUrl.indexOf('admin') !== -1) {
            res.redirect('/loginform');
        }
        else {
            res.status(403);
            res.json({ error: 'Brak dostępu' });
        }
    }
}