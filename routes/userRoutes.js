const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
router.route('/signup').post(authController.singUp)
router.route('/login').post(authController.login)
router.route('/users').delete(userController.deleteAllUsers)
module.exports = router
