const Media = require("../models/media")
const { deleteMediaFromCloudinary } = require("../Utils/cloudinary")
const logger = require("../Utils/logger")

const handlePostDeleted = async(event) => {
    console.log(event,"postDeletedEvent")
    const{postId,mediaIds} = event 
    try{
        const mediaToDelete = await Media.find({_id:{$in:mediaIds}})
        console.log(mediaToDelete,"mediaToDelete")
        for (const media of mediaToDelete){
            console.log(media,"count media ")
            await deleteMediaFromCloudinary(media.publicId)
            await Media.findByIdAndDelete(media._id)
            logger.info(`deleted media ${media._id} associated with this deleted post ${[postId]}`)      
        }

        logger.info(`Processed deletion of media for post id ${postId}`)

    } catch(err) {
        logger.error(`Error occured while deleting post from cloudinary and Database`)
    }
}

module.exports = {handlePostDeleted}