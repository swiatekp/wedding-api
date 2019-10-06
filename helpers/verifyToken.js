exports.verifyToken = (req, res, next) => {
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
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
    else {
        if (req._parsedOriginalUrl.path === '/login') {
            res.json({ message: 'Tutaj będzie formularz logowania do panelu admina' });
        }
        else {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
    }
}