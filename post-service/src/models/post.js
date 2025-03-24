const { Schema, model} = require('mongoose')

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaIds: [
        {
            type: String,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    { timestamps: true }
)

postSchema.index({content:'text'})
const Post = model('post',postSchema)

module.exports = Post



