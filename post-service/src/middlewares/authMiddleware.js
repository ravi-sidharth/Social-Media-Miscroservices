const logger = require("../Utils/logger")


const authenticateRequest = async(req,res,next)=> {
    const userId = req.headers['x-user-id']
    
    if(!userId) {
        logger.warn('Accessed attemped withiout user Id')
        return res.status(401).json({
            success:false,
            message:'Authencation is Required, Please login to continue!'
        })
    }
    req.user = { userId }
    next()
}

module.exports = {authenticateRequest}