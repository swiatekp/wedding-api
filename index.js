const express = require('express');
const path = require('path');
const db = require('./helpers/db');
const config = require('./config');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./helpers/verifyToken');

//Routers
const guestsRouter = require('./routers/guestsRouter');
const loginRouter = require('./routers/loginRouter');

//Express setup
const app = express();

//MongoDB connection
db.connect(err => {
    if (err) return console.log('Database connection failed');
    console.log('Database connection succeeded.')
    app.listen(2137, () => console.log('Server is listening on The Papa-Port'));
});

//Middlewares
app.use(express.static(path.join(__dirname, 'admin')));
app.use(express.json());
app.use('/api/guests/', guestsRouter);
app.use('/login', loginRouter);

app.get('/admin', verifyToken, (req, res) => {
    jwt.verify(req.token, config.jwtSecretKey, (err, authData) => {
        if (err) {
            res.status(403);
            res.json({ error: 'Forbidden' });
        }
        else {
            res.json({
                message: 'Logged in',
                authData
            });
        }
    })
});