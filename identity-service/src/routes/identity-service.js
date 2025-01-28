const express = require('express')
const { handleUserRegister } = require('../controllers/identity-controller')

const router = express.Router()

router.post('/register',handleUserRegister)


module.exports = router