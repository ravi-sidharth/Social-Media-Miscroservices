const Joi = require('joi') 

const validationRegistration = (data) => {
    const schema = Joi.object({
        username:Joi.string().min(3).max(50).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).lowercase().required()
    })

    return schema.validate(data)
}

const loginValidation = data => {
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(6)
    })
    return schema.validate(data)
}

module.exports = {validationRegistration,loginValidation}