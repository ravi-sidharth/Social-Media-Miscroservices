const logger = require("../Utils/logger")

const errorHandler = (err,req,res,next) => {
    logger.error(err.stack) 
    res.status(err.status || 500).json({
        message:'error',
        error:err.message
    })
}

module.exports = errorHandler