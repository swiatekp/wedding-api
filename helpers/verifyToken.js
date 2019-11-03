exports.verifyToken = (req, res, next) => {
    //bearer can be passed in two ways
    //first - by header (fetch etc)
    //second - by query params - by frontend
    if (typeof req.headers['authorization'] !== "undefined") {
        const bearerHeader = req.headers['authorization'];
        // Format of the token:
        // Authorization: Bearer <access_token>
        // Split at the space to get the token out of the string

        const bearer = bearerHeader.split(' ');
        //Get token from the array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //Next middleware
        next();
    }
    else if (req.query['bearer']) {
        req.token = req.query['bearer'];
        next();
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