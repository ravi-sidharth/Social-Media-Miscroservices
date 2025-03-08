const logger = require("../Utils/logger");

const authenticateRequest =(req,res,next) => {
    const userId = req.headers['x-user-id']
    console.log(userId,"userID")

    if (!userId) {
        logger.warn('user not logged in ,Please login to continue!')
        return res.status(401).json({
            success:false,
            message:'user not found!'
        })
    }
    req.user = {userId}
    next()
}

module.exports = {authenticateRequest}

