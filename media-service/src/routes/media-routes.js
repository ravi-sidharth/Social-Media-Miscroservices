const express = require('express')
const {authenticateRequest} = require('../middlewares/authMiddleware')
const logger = require('../Utils/logger')
const {uploadMedia, getMedia}= require('../controllers/media-controller')
const multer = require('multer')

const router = express.Router()

// configure multer for file upload 
const upload = multer({
    storage : multer.memoryStorage(),
    limits : {fileSize: 10 * 1024 * 1024},
}).single('file')

router.post('/upload',authenticateRequest,(req,res,next)=> {
    upload(req,res,function(err){
        if (err instanceof multer.MulterError) {
            logger.error(`Multer error occured While uploading:${err}`)
            return res.status(err.status || 400).json({
                message:'Multer error occured While uploading:',
                error:err.message,
                stack:err.stack
            })
        } else if(err) {
            logger.error(`Unknown error occured While uploading:${err}`)
            return res.status(err.status || 400).json({
                message:'Unknown error occured While uploading:',
                error:err.message,
                stack:err.stack
            })
        }
        if(!req.file) {
            return res.status(400).json({
                message:'File not found!'
            })
        }
        next()
    }) 
},uploadMedia) 


router.get('/get',authenticateRequest,getMedia)

module.exports = router
