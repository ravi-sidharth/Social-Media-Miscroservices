const logger = require('../utils/logger')
const User = require('../models/user')
const {validationRegistration} = require('../utils/validation')
const { generateToken } = require('../utils/generateToken')

// user Registration 
const handleUserRegister = async(req,res) => {
    logger.info('Registeration endpoint hit...')
   try {
        // validate the schema 
        const {error} = validationRegistration(req.body)    
        if (error) {
            logger.warn('Validation error',error.details[0].message)
            return res.status(400).json({
                success:false,
                message:error.details[0].message
            })
        }

    const {username,email, password} = req.body

    let user = await User.findOne({$or:[{username},{email}]})
    if (user) {
        logger.warn('User already exists, Please try again with another account!')
        return res.status(400).json({
            success:false,
            message:"User already exists, Please try again with another account!"
        })
    }
    user = new User({
        username,
        email,
        password
    })
    await user.save()
    logger.warn('User saved successfully!',user._id)

    const {accessToken,refreshToken} = await generateToken(user)

    res.status(201).json({
        success:true,
        message:"User register successfully!",
        accessToken,
        refreshToken
    })

   } catch(err) {
        logger.error('Registeration error occured',err)
        res.status(500).json({
            success:false,
            message:"Internal server error "

        })
   }
}

// user login 



// refresh token 



// user logout 

module.exports = {
    handleUserRegister,

}