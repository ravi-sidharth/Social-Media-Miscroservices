const logger = require('../utils/logger')
const User = require('../models/user')
const {validationRegistration, loginValidation} = require('../utils/validation')
const { generateToken } = require('../utils/generateToken')
const RefreshToken = require('../models/refreshToken')

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
const handleUserLogin = async(req,res) => {
    const {error} = loginValidation(req.body) 
    if (error) {
        logger.error('validationError:',error.details[0].message)
        return res.status(429).json({
            success:false ,
            error:error.details[0].message
        })
    }

    const {email, password} = req.body
    const user = await User.findOne({email})
    if (!user) {
        logger.warn('User not found')
        return res.status(400).json({
            success:false,
            message:'User not found!'
        })
    }

    const isPasswordMatch = await user.comparePassword(password)
    if (!isPasswordMatch) {
        logger.warn('Invalid credential!')
        return res.status(400).json({
            success:false,
            message:'Invalid credential!'
        })
    }

    const {accessToken,refreshToken} =await generateToken(user)
    logger.info('User successully login')
    res.status(200).json({
        success:true,
        message:'User login successfully',
        accessToken,
        refreshToken
    })
}

// refresh token 
const changeRefreshToken = async(req, res)=> {
    const {refreshToken} = req.body
    if (!refreshToken) {
        logger.warn('credential not found!')
        return res.status(404).json({
            success:false,
            message:'credential not found'
        })
    }

    const token = await RefreshToken.findOne({token:refreshToken})
    if (!token || token.expiredAt < Date.now()) {
        logger.warn('Invalid or expired token')
        return res.status(400).json({
            success:false,
            message:'Invalid or expired token'
        })
    }
    const user = await User.findById(token.user)

    // delete refresh token 
    await RefreshToken.findByIdAndDelete(token._id)

    const {accessToken:newAccessToken , refreshToken:newRefreshToken} =await generateToken(user)

    logger.info('Change refreshToken')
    res.status(200).json({
        success:true,
        message:"Change refreshToken",
        refreshToken:newRefreshToken,
        accessToken:newAccessToken
    })
}

// user logout 
const handleUserLogout = async(req,res) => {
    const {refreshToken} = req.body
    if (!refreshToken) {
        logger.warn('credential not found!')
        return res.status(404).json({
            success:false,
            message:'credential not found'
        })
    }

    const token = await RefreshToken.findOne({token:refreshToken})
    if (!token || token.expiredAt < Date.now()) {
        logger.warn('Invalid or expired token')
        return res.status(400).json({
            success:false,
            message:'Invalid or expired token'
        })
    }

    await RefreshToken.findByIdAndDelete(token._id)
    logger.info('User Logged Out')
    res.status(200).json({
        success:true,
        message:"User Logged Out",
    })
}

module.exports = {
    handleUserRegister,
    handleUserLogin,
    changeRefreshToken,
    handleUserLogout
}