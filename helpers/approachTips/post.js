const multer = require('multer');
const fs = require('fs');
const path = require('path');

const insertTip = require('./dbOperationsHelpers/insertTip');
const respondWithAnError = require('../guests/respondWithAnError');


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
    upload(req, res, err => {
        if (err) {
            //if the error occured after the file was uploaded, remove the file
            if (req.filename) {
                fs.unlink(`../uploads/${req.filename}`, err => {
                    return null;
                });
            }
            respondWithAnError(res, 500, err.message);
        }
        else {
            req.filename ? null : req.filename = null;
            const { content, category } = req.body;
            insertTip(content, category, req.filename)
                .then((resp) => {
                    res.json(resp);
                })
                .catch(err => {
                    console.log(err);
                    if (req.filename) {
                        //error occured - the file that was uploaded, must be removed
                        fs.unlink(`./uploads/${req.filename}`, err => {
                            return null;
                        });
                    }
                    respondWithAnError(res, 500, err.error);
                })
        }
    })
}