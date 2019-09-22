module.exports = (res, status, message) => {
    res.status(status);
    res.json({ error: message })
}