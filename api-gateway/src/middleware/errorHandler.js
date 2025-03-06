const logger = require("../utils/logger")

const errorHandler = (err,req,res,next) => {
    logger.error(err.stack)
    return res.status(err.status || 500).json({
        success:false,
        message:err.message || 'Internal server error'
    })
}

module.exports = errorHandler