const {Schema, model} = require('mongoose')
const argon2 = require('argon2')

const userSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        lower:true
    },
    password: {
        type:String,
        required:true
    }

}, {timestamps:true})

userSchema.pre("save",async function(next) {
    try {
        if (this.isModified("password")) {
            this.password =await argon2.hash(this.password)
        }
    } catch(e) {
        return next(e)
    }
})

userSchema.methods.comparePassword = async function(userPassword) {
    try {
       return await argon2.verify(this.password,userPassword)
    } catch(e) {
        throw e
    }
}

userSchema.index({username:'text'})

module.exports = model('user',userSchema)