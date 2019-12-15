const express = require('express');
const router = express.Router();
const db = require('../helpers/db.js');
const respondWithAnError = require('../helpers/guests/respondWithAnError');
const { verifyUid } = require('../helpers/verifyUid');
const validateDate = require('../helpers/validateDate');

router.get('/', (req, res) => {
    //get all data - available for everyone
    const collection = db.get().collection('pageInfo');
    collection.find({}).toArray((err, result) => {
        if (err) {
            respondWithAnError(res, 500, "Wewnętrzny błąd serwera");
        }
        else if (result.length === 0) {
            respondWithAnError(res, 404, "Nie znaleziono");
        }
        else {
            delete result[0]._id; //It's not neccessary to let the client know, what the _id is. 
            res.json(result[0]);
        }
    });
});
router.put('/', verifyUid, (req, res) => {
    const collection = db.get().collection('pageInfo')
    const { pageTitle, weddingDate, brideName, brideTel, brideMail, groomName, groomTel, groomMail, landingpageText } = req.body;
    const updateObject = {};
    const pageTitleRegex = /^[a-z0-9ęóąśłżźćń.,-_? ]{2,250}$/i
    //Check page Title
    if (typeof pageTitle === "string" && pageTitle !== "") {
        if (pageTitleRegex.test(pageTitle)) {
            Object.assign(updateObject, { pageTitle })
        }
        else {
            respondWithAnError(res, 400, "Tytuł strony nieprawidłowy. Powinien mieć pomiędzy 2 a 250 znaków i składać się z liter, cyfr i spacji, oraz nie posiadać niedozwolnych znaków. ");
            return;
        }
    }
    //check the wedding date
    //wedding date should be given in the following format:
    // YYYY:MM:DDTHH:MM
    if (typeof weddingDate === "string" && weddingDate !== "") {
        dateValidated = validateDate(weddingDate)
        if (dateValidated) {
            Object.assign(updateObject, { weddingDate: dateValidated });
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowa data ślubu");
        }
    }
    //bride name verification
    const nameRegex = /^[a-z0-9ęóąśłżźćń ]{2,30}$/i
    if (typeof brideName === "string" && brideName !== "") {
        if (nameRegex.test(brideName)) {
            Object.assign(updateObject, { brideName });
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowe imię narzeczonej");
        }

    }
    //groom name verification
    if (typeof groomName === "string" && groomName !== "") {
        if (nameRegex.test(groomName)) {
            Object.assign(updateObject, { groomName });
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowe imię narzeczonego");
        }

    }
    //bride e-mail verification
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (typeof brideMail === "string" && brideMail !== "") {
        if (emailRegex.test(brideMail)) {
            Object.assign(updateObject, { brideMail });
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowy adres e-mail narzeczonej");
        }
    }
    //groom e-mail verification
    if (typeof groomMail === "string" && groomMail !== "") {
        if (emailRegex.test(groomMail)) {
            Object.assign(updateObject, { groomMail });
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowy adres e-mail narzeczonego");
        }
    }
    //bride telephone number verification
    const phoneNumberRegex = /^[+]{0,1}[0-9 -]{5,30}$/;
    if (typeof brideTel === "string" && brideTel !== "") {
        if (phoneNumberRegex.test(brideTel)) {
            Object.assign(updateObject, { brideTel });
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowy numer telefonu narzeczonej");
        }
    }
    if (typeof groomTel === "string" && groomTel !== "") {
        if (phoneNumberRegex.test(groomTel)) {
            Object.assign(updateObject, { groomTel });
        }
        else {
            respondWithAnError(res, 400, "Nieprawidłowy numer telefonu narzeczonego");
        }
    }
    if (typeof landingpageText === "string" && landingpageText !== "") {
        Object.assign(updateObject, { landingpageText });
    }
    //check if updateObject is empty
    if (Object.keys(updateObject).length === 0 && updateObject.constructor === Object) {
        respondWithAnError(res, 400, "Nieprawidłowe zapytanie do API");
    }
    else {
        collection.updateOne(
            {},
            {
                $set: updateObject
            },
            (err, result) => {
                if (err) {
                    respondWithAnError(res, 500, 'Wewnętrzny błąd serwera');
                }
                else if (result.matchedCount === 0) {
                    //If there is no such document yet, add it
                    collection.insertOne(updateObject, (err) => {
                        if (err) {
                            respondWithAnError(res, 500, 'Wewnętrzny błąd serwera');
                        }
                        else {
                            res.json({ message: 'Udało się' });
                        }
                    });
                }
                else {
                    res.json({ message: 'Udało się' });
                }
            }
        );
    }

});
router.all('*', (req, res) => {
    respondWithAnError(res, 400, 'Nieprawidłowe zapytanie do API');
})
module.exports = router;