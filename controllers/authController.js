const { User } = require('../models')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
console.log(process.env.JWT_SECRET)
//-------------------------------------------
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}
//-------------------------------------------
exports.singUp = catchAsync(async (req, res, next) => {
  const { password, username, passwordConfirm } = req.body
  let newUser, token
  //1------- check if the fields are provided
  if (!(password && username && passwordConfirm)) {
    return next(
      new AppError(
        'please provide your username , password and paswordConfirm',
        400,
      ),
    )
  }
  //1-2 ---- create the user :
  newUser = await User.create({ username, password, passwordConfirm })
  // 2------- check if the user created
  if (newUser) {
    console.log('new user : ', newUser)
    //3--------- sign the token
    const id = newUser.username
    token = signToken(id)
  }
  //4----------- send a response containing the newly created user and the token
  res.status(201).json({
    status: 'success',
    newUser,
    token,
  })
})
//-------------------------------------------

exports.login = catchAsync(async (req, res, next) => {
  const { password, username } = req.body
  // 1--------- check if the user provide the username and password
  if (!password || !username) {
    return next(
      new AppError(
        'please provide your username and password to get access to the app',
        403,
      ),
    )
  }
  // 2 ---------- check if the user exists based on his username
  const user = await User.findOne({ where: { username } })
  if (!user) {
    return next(
      new AppError('Invalid username or password , please try again', 401),
    )
  }
  // 3 ---------- check if the password correct :
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return next(new AppError('Invalid username or password', 401))
  }
  //4 -------- Generate JWT token
  const token = signToken(user.username)
  //5 --------- store the token in user cookies :
  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  //   ),
  //   httpOnly: true,
  // }
  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true
  // }
  // res.cookie('token', token, cookieOptions)
  //6--------- Send response with token
  res.status(200).json({
    status: 'success',
    message: 'Login successful.',
    token,
  })
})
//-------------------------------------------
exports.protect = catchAsync(async (req, res, next) => {
  let token

  // 1. Check if the token is sent in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1] // Extract the token from the 'Bearer <token>' format
  }

  // 2. Check if the token exists
  if (!token) {
    return next(
      new AppError('You are not logged in, please login to get access', 401),
    )
  }
  next()
})
