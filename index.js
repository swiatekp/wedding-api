const express = require('express');
const db = require('./helpers/db');
const config = require('./config');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('./helpers/verifyToken');

//Routers
const guestsRouter = require('./routers/guestsRouter');
const loginRouter = require('./routers/loginRouter');
const adminRouter = require('./routers/adminRouter');

//Express setup
const app = express();

//MongoDB connection
db.connect(err => {
    if (err) return console.log('Database connection failed');
    console.log('Database connection succeeded.')
    app.listen(2137, () => console.log('Server is listening on The Papa-Port'));
});

//Middlewares
app.use(express.json());
app.use('/api/guests/', guestsRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);