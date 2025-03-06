const logger = require("../Utils/logger");

const errorHandler = async(err,req,res,next) => {
    logger.error(err.stack)
    res.status(err.status || 500).json({
        success:false,
        error:err.message || 'Internal error occured!'
    })
}

module.exports = errorHandler 