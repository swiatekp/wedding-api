const IS_PROD = false; //Enables things, that are required to keep the app running in development process.
// set IS_PROD to true before deploying the app to the production

const express = require('express');
const session = require('express-session');
const db = require('./helpers/db');
const path = require('path');

//Routers
const guestsRouter = require('./routers/guestsRouter');
const loginRouter = require('./routers/loginRouter');
const adminRouter = require('./routers/adminRouter');
const pageRouter = require('./routers/pageRouter');
const accountRouter = require('./routers/accountRouter');
const approachTipsRouter = require('./routers/approachTipsRouter');


//Express setup
const app = express();

//MongoDB connection
db.connect(err => {
    if (err) return console.log('Database connection failed');
    console.log('Database connection succeeded.');
    const PORT = process.env.PORT || 2137;
    app.listen(PORT, () => console.log(`Server is listening on ${PORT === 2137 ? 'The Papa-Port' : `port ${PORT}`}`));
});

//Middlewares
app.use(express.json());

app.use(session({
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    secret: 'DRŻYZESTRACHUCZERŃKOZACZA',
    cookie: {
        maxAge: 3 * 60 * 60 * 1000,
        sameSite: true,
        secure: IS_PROD, //only makes sense in production
    }
}))

if (IS_PROD === false) {
    app.use(function (req, res, next) {
        //THIS IS A TEMPORARY CORS-RELATED PROBLEMS FIX. SET IS_PROD to true before deploying the app
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization");
        next();
    });
}
app.use('/api/guests/', guestsRouter);
app.use('/login', loginRouter);
app.use('/loginform', express.static(path.join(__dirname, 'loginform')));
app.use('/admin', adminRouter);
app.use('/admin', express.static(path.join(__dirname, 'admin/build'))); //When adminRouter verifies, if the user is logged in, it uses next() to run another middleware - 
app.use('/static', express.static(path.join(__dirname, 'admin/build/static')));
app.use('/admin/*', express.static(path.join(__dirname, 'admin/build')));
app.use('/page', pageRouter);
app.use('/account', accountRouter);
app.use('/api/approach-tips', approachTipsRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));