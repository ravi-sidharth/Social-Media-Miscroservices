const logger = require("../Utils/logger")
const Search = require('../models/search')

const handlePostCreated = async(event) => {
    try {
        const { postId, userId, content, createdAt } = event;
        
        const newSearchPost = new Search({
            postId,
            userId,
            content,
            createdAt
        })
        await newSearchPost.save()

        logger.info(`Search post created :${postId},  ${newSearchPost._id}`)
    } catch (err) {
        logger.error(`Error occured while handling post created data`, err)
    }
}

const handlePostDeleted = async (event) => {
    try {
        await Search.findOneAndDelete({post:event.postId})
        logger.info(`Search post deleted :${event.postId}`)
    } catch (err) {
        logger.error(`Error occured while handling post deleted data`, err)
    }
}
module.exports = { handlePostCreated,handlePostDeleted }