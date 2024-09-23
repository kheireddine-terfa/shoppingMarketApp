const AppError = require('../utils/appError')

const sendErrorDev = (err, res) => {
  const statusCode = err.statusCode || 500
  const status = err.status || 'error'
  const message = err.message

  return res.status(statusCode).json({
    status: status,
    message: message,
    error: err,
    stack: err.stack,
  })
}
const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || 500
  const status = err.status || 'error'
  const message = err.message
  // trusted errors : created by our ourselves
  if (err.isOperational) {
    return res.status(statusCode).json({
      status: status,
      message: message,
    })
  } else {
    // untrusted errors : (programming errors , third party lib errors...)
    //1 : log the error
    console.error('ERROR 💥 :', err)
    //2 : send a generic response
    return res.status(500).json({
      message: 'something went very wrong , please try again later (:',
    })
  }
}
const handleValidationErrorDB = (err) => {
  const message = err.errors.map((err) => err.message).join('| ')
  return new AppError(message, 400)
}
const handleDuplicateFieldsDB = (err) => {
  let message
  if (err.errors.length >= 2) {
    message = `Duplicate Fields : ${err.errors
      .map((err) => err.message)
      .join('| ')}`
  } else {
    message = `Duplicate Field : ${err.errors[0].message}`
  }
  return new AppError(message, 400)
}
module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    if (error.name === 'SequelizeValidationError')
      error = handleValidationErrorDB(error)
    if (error.name === 'SequelizeUniqueConstraintError')
      error = handleDuplicateFieldsDB(error)
    sendErrorProd(error, res)
  }
}
