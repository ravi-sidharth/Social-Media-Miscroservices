const Post = require("../models/post");
const logger = require("../Utils/logger");
const { postCreationValidation } = require("../Utils/validation");

const createPost = async(req,res) => {
    try{
        const {error}= postCreationValidation(req.body)
        if (error) {
            logger.error(error.details[0].message)
            return res.status(error.status || 500).json({
                success:false,
                message:error.details[0].message
            })
        }
        const {content, mediaIds} = req.body
        const newlycreatedPost = new Post({
            user:req.user.userId,
            content,
            mediaIds:mediaIds || []
        })
        await newlycreatedPost.save()
        
        logger.info('Post created Successfully',newlycreatedPost)
        res.status(201).json({
            success:true,
            message:'Post created successfully'
        })
    } catch(err) {
        logger.error('Error occured while creating post',err)
        res.status(500).json({
            success:false,
            message:'Error occured while creating post.'
        })
    }
}

const getAllPosts = async(req,res) => {
    try{
      
    } catch(err) {
        logger.error('Error occured while fetching all post',err)
        res.status(500).json({
            success:false,
            message:'Error occured while fetching all post.'
        })
    }
}

const getPostByID = async(req,res) => {
    try{
       
    } catch(err) {
        logger.error('Error occured while getting post by Id',err)
        res.status(500).json({
            success:false,
            message:'Error occured while getting post by Id.'
        })
    }
}

const deletePost = async(req,res) => {
    try{
       
    } catch(err) {
        logger.error('Error occured while deleting post',err)
        res.status(500).json({
            success:false,
            message:'Error occured while deleting post.'
        })
    }
}

const updatePost = async(req,res) => {
    try{
        
    } catch(err) {
        logger.error('Error occured while updating post',err)
        res.status(500).json({
            success:false,
            message:'Error occured while updating post.'
        })
    }
}
module.exports = {
    createPost,
}