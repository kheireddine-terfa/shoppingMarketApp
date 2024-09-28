const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
console.log(process.env.JWT_SECRET)
//-------------------------------------------
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}
//-------------------------------------------
exports.singUp = async (req, res) => {
  try {
    const { password, username } = req.body
    let newUser, token
    //1------- check if the fields are provided
    if (password && username) {
      newUser = await User.create({ username, password })
    } else {
      return res.json(404).json({
        status: 'fail',
        message: 'please provide your username and password ',
      })
    }
    // 2------- check if the user created
    if (newUser) {
      //3--------- sign the token
      const id = newUser.dataValues.username
      token = signToken(id)
    }
    //4----------- send a response containing the newly created user and the token
    res.status(201).json({
      status: 'success',
      newUser,
      token,
    })
  } catch (error) {
    console.log('ERROR 💥 :', error)
  }
}
//-------------------------------------------

exports.login = async (req, res) => {
  const { password, username } = req.body
  console.log('--------------', req.body)
  // 1--------- check if the user provide the username and password
  if (!password || !username) {
    return res.status(403).json({
      status: 'fail',
      message:
        'please provide your username and password to get access to the app',
    })
  }
  // 2 ---------- check if the user exists based on his username
  const user = await User.findOne({ where: { username } })
  if (!user) {
    return res
      .status(401)
      .json({ message: 'Invalid username or password , please try again' })
  }
  console.log(user)
  // 3 ---------- check if the password correct :
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid username or password' })
  }
  //4 -------- Generate JWT token
  const token = signToken(user.username)
  //5 --------- store the token in user cookies :
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
  }
  res.cookie('token', token, cookieOptions)
  //6--------- Send response with token
  res.status(200).json({
    status: 'success',
    message: 'Login successful.',
    token,
  })
}
