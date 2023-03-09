const errorHandler = (err, req, res, next) => {
    console.log(err)
    console.log("error handler")
    return res.status(500).json({ messagge : err });
}

module.exports = errorHandler;