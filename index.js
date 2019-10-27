const express = require('express');
const db = require('./helpers/db');
const path = require('path');

//Routers
const guestsRouter = require('./routers/guestsRouter');
const loginRouter = require('./routers/loginRouter');
const adminRouter = require('./routers/adminRouter');
const pageRouter = require('./routers/pageRouter');

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
app.use(function (req, res, next) {
    //THIS IS A TEMPORARY CORS-RELATED PROBLEMS FIX. SHOULD BE REMOVED IN PRODUCTION VERSION
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
    next();
});
app.use('/api/guests/', guestsRouter);
app.use('/login', loginRouter);
app.use('/admin', adminRouter);
app.use('/admin', express.static(path.join(__dirname, 'admin'))); //When adminRouter verifies, if the user is logged in, it uses next() to run another middleware - 
app.use('/page', pageRouter);