const {Schema,model} = require('mongoose')

const mediaSchema = new Schema({
    publicId: {
        type:String,
        required:true
    },
    originalName: {
        type:String,
        required:true 
    },
    mimeType: {
        type:String,
        required:true
    },
    url: {
        type:String,
        required:true
    },
    userId: {
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }

},{timestamps:true})

const Media = model('media',mediaSchema) 

module.exports = Media 