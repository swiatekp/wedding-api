const multer = require('multer');
const fs = require('fs');
const path = require('path');

const updateTips = require('./dbOperationsHelpers/updateTips');
const findTips = require('./dbOperationsHelpers/findTips');
const respondWithAnError = require('../guests/respondWithAnError');
const db = require('../db.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const filename = `approach-tips-${Date.now()}${path.extname(file.originalname)}`;
        req.filename = filename;
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
            return cb(new Error('Dozwolone są tylko pliki typu: jpg, jpeg, png i gif.'));
        }

        return cb(null, true);
    },
    limits: {
        fileSize: 1024 * 1024
    }
}).single('file');

module.exports = (req, res) => {
    const ObjectID = db.mongo.ObjectID;
    const id = req.params.id;

    if (ObjectID.isValid(id)) {
        findTips({ _id: ObjectID(id) })
            .then(tip => {
                //if there was a file, remove it
                const prevFilename = tip[0].filename;
                if (prevFilename) {
                    fs.unlink(`./uploads/${prevFilename}`, err => {
                        return null;
                    });
                }
                upload(req, res, err => {
                    if (err) {
                        //if the error occured after the file was uploaded, remove the file
                        if (req.filename) {
                            fs.unlink(`./uploads/${req.filename}`, err => {
                                return null;
                            });
                        }
                        respondWithAnError(res, 500, err.message);
                    }
                    else {
                        //image was updated successfully - now update the database
                        updateTips(
                            {
                                _id: ObjectID(id)
                            },
                            {
                                $set: {
                                    filename: req.filename
                                }
                            }
                        )
                            .then(result => {
                                res.json({ result })
                            })
                            .catch(err => {
                                respondWithAnError(res, err.status, err.error);
                            })
                    }
                });

            })
            .catch(err => {
                respondWithAnError(res, err.status, err.error);
            })
    }
    else {
        respondWithAnError(res, 400, 'Nieprawidłowe ID');
    }
}