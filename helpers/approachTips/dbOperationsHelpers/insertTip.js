const db = require('../../db.js');
const findTips = require('./findTips');

module.exports = (content, category, filename) => {
    const contentRegex = /^[a-z0-9ęóąśłżźćń!()_\-:;"',.? ]{5,255}$/igm;
    return new Promise((resolve, reject) => {
        if (typeof content === "string" && contentRegex.test(content)) {
            if (category === "1" || category === "2") {
                const collection = db.get().collection('approach-tips');
                //count the records in the category
                //length is our orderIndex

                findTips({ category })
                    .then(result => {
                        const orderIndex = result.length;
                        collection.insertOne({
                            content, category, filename, orderIndex
                        }, err => {
                            if (err) {
                                reject({ error: 'Nie udało się dodać wpisu do bazy' });
                            }
                            else {
                                resolve({ message: 'Udało się' });
                            }
                        })
                    })
                    .catch(err => {
                        if (err.status === 404) {
                            orderIndex = 0;
                            collection.insertOne({
                                content, category, filename, orderIndex
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
                            reject({ error: 'Nie udało się przeszukać bazy' });
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