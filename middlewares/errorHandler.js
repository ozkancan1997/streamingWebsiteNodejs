const errorHandler = (err, req, res, next) => {
    console.log("ahmet")
    return res.status(500).json({ messagge : err });
}

module.exports = errorHandler;