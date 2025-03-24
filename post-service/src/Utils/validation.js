const Joi = require('joi')

const postCreationValidation = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(3).max(500).required(),
        mediaIds:Joi.array()
    })
    return schema.validate(data)
}

module.exports = { postCreationValidation }