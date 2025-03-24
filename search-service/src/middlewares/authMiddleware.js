const logger = require("../Utils/logger")

const authenticateRequest = (req, res,next)  => {
    const userId = req.headers['x-user-id'] 
    if(!userId) {
        logger.info('Authentication is required, Please login to continue!')
        return res.status(403).json({
            success:false,
            message:'Authentication is required, Please login to continue'
        })
    }
    req.user = {userId}
    next()
}

module.exports = authenticateRequest

