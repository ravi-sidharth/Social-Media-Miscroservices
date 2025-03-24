const { createPost, getAllPosts, getPostById, deletePost } = require("../controllers/post-controller");
const {authenticateRequest} = require("../middlewares/authMiddleware");
const logger = require("../Utils/logger");
const express = require('express')

const router = express.Router()

router.use(authenticateRequest)
router.post('/create-post',createPost)
router.get('/get-posts',getAllPosts)
router.get('/:postId',getPostById)
router.delete('/:id',deletePost)

module.exports = router 


