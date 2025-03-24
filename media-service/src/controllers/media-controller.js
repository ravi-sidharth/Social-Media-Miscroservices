const Media = require("../models/media");
const {uploadMediaToCloudinary }= require("../Utils/cloudinary");
const logger = require("../Utils/logger");

const uploadMedia = async(req,res) => {
    try{
        if (!req.file) {
            logger.warn('file not found!, Please try again!')
            return res.status(400).json({
                success:false,
                message:'file not found, Please try again !'
            })
        }
        console.log(req.file,"file")
        const {originalname, mimetype, buffer} = req.file   
        const userId = req.user.userId 
        
        logger.info(`File Details: name:${originalname}, type:${mimetype}`)

        logger.info('Uploading to cloudinary to start...')
        const uploadCloudinaryResult = await uploadMediaToCloudinary(req.file)
        console.log(uploadCloudinaryResult,"upload Media result")
        
        const {public_id,secure_url} = uploadCloudinaryResult
        logger.info(`Image uploaded succeffully, public_id: ${public_id}`)
    
        const newlyCreatedMedia = new Media({
            publicId:public_id,
            originalName:originalname,
            mimeType:mimetype,
            url:secure_url,
            userId
        })
        await newlyCreatedMedia.save()
    
        res.status(201).json({
            success:true,
            message:'Media uploaded is successfully',
            mediaId:newlyCreatedMedia._id ,
            url:newlyCreatedMedia.url,
        })
    } catch(err) {
        logger.error('Error occured while uploading media',err)
        res.status(500).json({
            success:false,
            message:'Error occured while uploading media'
        })
    }
}

const getMedia = async(req,res) => {
   try {
    const result = await Media.find({});
    res.json({result})

   } catch(err) {
    logger.error('Error occured while fetching the post',err);
    res.status(400).json({
        success:false,
        message:'Error occured while fetching the post',err
    });
   }
}

module.exports = {
    uploadMedia,
    getMedia
}