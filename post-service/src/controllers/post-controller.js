const { JsonWebTokenError } = require("jsonwebtoken");
const Post = require("../models/post");
const logger = require("../Utils/logger");
const { postCreationValidation } = require("../Utils/validation");
const invalidatePostCache = require("../Utils/invalidatePostCache");
const { publishEvent } = require("../Utils/rabbitmq");

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

        // publish Event 
        await publishEvent('post.created',{
            postId:newlycreatedPost._id.toString(),
            userId:newlycreatedPost.user,
            content:newlycreatedPost.content,
            createdAt:newlycreatedPost.createdAt 

        })

        await invalidatePostCache(req,newlycreatedPost._id.toString())
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex =  (page-1)*limit ;

        const cacheKey = `posts:${page}:${limit}`
        const cachedPosts = await req.redisClient.get(cacheKey);

        if(cachedPosts) {
            return res.json(JSON.parse(cachedPosts))
        }

        const posts = await Post.find({}).sort({createdAt:-1}).skip(startIndex).limit(limit)
        const totalNoOfPosts = await Post.countDocuments()

        const result = {
            posts,
            currentPage:page,
            totalPages: Math.ceil(totalNoOfPosts/limit),
            totalPosts:totalNoOfPosts,
        }
        
        // Save your posts in redis cache 
        await req.redisClient.setex(cacheKey,300,JSON.stringify(result))
        res.json(result)

    } catch(err) {
        logger.error('Error occured while fetching all post',err)
        res.status(500).json({
            success:false,
            message:'Error occured while fetching all post.'
        })
    }
}

const getPostById = async(req,res) => {
    try{
        const { postId }= req.params
        const key = `post:${postId}`

        const cachedPosts = await req.redisClient.get(key)
        if (cachedPosts ) {
            return res.json(JSON.parse(cachedPosts))
        }
        const posts = await Post.findById(postId)

        if (!posts) {
            return res.json({
                success:false,
                message:'posts not found!'
            })
        }
   
        // Cached post in redis 
        await req.redisClient.setex(key,3600,JSON.stringify(posts))
        res.json(posts)

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

        const post = await Post.findOneAndDelete({
            _id:req.params.id,
            user:req.user.userId
        })
        if (!post) {
            return res.status(404).json({
                success:false,
                message:'You are not authorized to delete this post'
            })}
        
        // publish post delete method -> 
        await publishEvent('post.deleted',{
            postId:post._id.toString(),
            userId:req.user.userId,
            mediaIds:post.mediaIds
        })

        await invalidatePostCache(req,req.params.id)
        res.json({
            success:true,
            message:'Post deleted successfully!'
        })


    } catch(err) {
        logger.error('Error occured while deleting post',err)
        res.status(500).json({
            success:false,
            message:'Error occured while deleting post.'
        })
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    deletePost
}