module.exports = queryObject => {
    const collection = db.get().collection('guests');
    return new Promise((resolve, reject) => {
        collection.deleteOne(queryObject, (err, guest) => {
            console.log(guest);
            if (err) {
                reject({ status: 500, error: 'Internal server error' });
            }
            else if (guest.deletedCount === 0) {
                reject({ status: 404, error: 'Nie znaleziono gościa' });
            }
            else {
                resolve({ message: 'Gość usunięty pomyślnie' });
            }
        })
    });
}