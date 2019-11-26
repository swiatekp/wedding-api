const db = require('../../db.js');

module.exports = (content, category, filename) => {
    const contentRegex = /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{5,255}$/igm;
    return new Promise((resolve, reject) => {
        if (typeof content === "string" && contentRegex.test(content)) {
            if (category === "1" || category === "2") {
                const collection = db.get().collection('approach-tips');
                collection.insertOne({
                    content, category, filename
                }, err => {
                    if (err) {
                        reject({ error: 'Nie udało się dodać wpisu do bazy' });
                    }
                    else {
                        resolve({ message: 'Udało się' });
                    }
                })
            }
            else {
                reject({ error: 'Nieprawidłowa kategoria' });
            }
        }
        else {
            reject({ error: 'Nieprawidłowa treść wskazówki' });
        }
    });
}