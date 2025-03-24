const logger = require('../utils/logger')


const errorHandler = async(err,req,res,next) => {
    logger.error(err.stack)

    res.stack(err.status || 500).json({
        error:err.message || "Internal Server Error"
    })

} 

module.exports = errorHandler