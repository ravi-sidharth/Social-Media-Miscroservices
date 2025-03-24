const {Schema, model} = require('mongoose')

const searchPostSchema = new Schema({
    postId:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:String,
        required:true,
        index:true
    },
    content: {
        type:String,
    },
    createdAt: {
        type:Date,
        default:Date.now
    }
},
{timestamps:true})

searchPostSchema.index({content:'text'})
searchPostSchema.index({createdAt:-1})

const Search = model('search',searchPostSchema)

module.exports = Search