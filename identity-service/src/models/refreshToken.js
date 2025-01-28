const {Schema, model} = require('mongoose')

const refreshTokenSchema = new Schema({
    token: {
        type:String,
        required:true,
        unique:true
    },
    user: {
        type:Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    expiredAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

refreshTokenSchema.index({expiredAt:1}, {expireAfterSeconds:0})

const RefreshToken =  model('refreshToken',refreshTokenSchema)

module.exports = RefreshToken