const express = require('express')
const authenticateRequest = require('../middlewares/authMiddleware')
const { searchPostController } = require('../controllers/search-controller')

const router = express.Router()

router.use(authenticateRequest)

router.get('/posts',searchPostController)

module.exports = router