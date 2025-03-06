const express = require('express')
const { handleUserRegister, handleUserLogin, changeRefreshToken, handleUserLogout } = require('../controllers/identity-controller')

const router = express.Router()

router.post('/register',handleUserRegister)
router.post('/login',handleUserLogin)
router.post('/refresh-token',changeRefreshToken)
router.post('/logout',handleUserLogout)

module.exports = router