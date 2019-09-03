const mongo = require('mongodb');
const config = require('../config');
const MongoClient = new mongo.MongoClient(config.db,
    { useNewUrlParser: true, useUnifiedTopology: true })

const state = {
    db: null
}

exports.connect = (done) => {
    if (state.db) return done();

    MongoClient.connect((err, db) => {
        if (err) throw new Error('Nie udało się połączyć');
        state.db = MongoClient.db('wedding-api');
        done();
    })
}
exports.get = () => {
    return state.db;
}

exports.close = done => {
    if (state.db) {
        state.db.close((err, result) => {
            state.db = null;
            state.mode = null;
            done(err);
        })
    }
}
exports.mongo = mongo;