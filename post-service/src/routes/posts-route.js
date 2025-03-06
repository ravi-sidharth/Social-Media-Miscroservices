const { createPost } = require("../controllers/post-controller");
const {authenticateRequest} = require("../middlewares/authMiddleware");
const logger = require("../Utils/logger");
const express = require('express')

const router = express.Router()

router.use(authenticateRequest)
router.post('/create-post',createPost)

module.exports = router 


