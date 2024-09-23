const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const appError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const userRoutes = require('./routes/userRoutes')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const expirationDateRoutes = require('./routes/expirationDateRoutes')
const productSupplyRoutes = require('./routes/productSupplyRoutes')
const productSaleRoutes = require('./routes/productSaleRoutes')
const saleRoutes = require('./routes/saleRoutes')
const supplierRoutes = require('./routes/supplierRoutes')
const supplyRoutes = require('./routes/supplyRoutes')

const app = express()
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception , Shutting down the Back-End server ...💥')
  console.log(err.name, err.message)
  process.exit(1)
})
dotenv.config({ path: './config.env' })

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/images', express.static(path.join(__dirname, 'public/images')))

app.use('/api', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/expiration-dates', expirationDateRoutes)
app.use('/api/product-supplies', productSupplyRoutes)
app.use('/api/product-sales', productSaleRoutes)
app.use('/api/sales', saleRoutes)
app.use('/api/suppliers', supplierRoutes)
app.use('/api/supplies', supplyRoutes)
// handling unhandled Routes
app.all('*', (req, res, next) => {
  next(new appError(`can't find ${req.originalUrl} on this app !`, 404))
})
app.use(globalErrorHandler)
const port = process.env.PORT || 3001
const server = app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})
process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection , Shutting Down the Back-End server...💥')
  console.log(err.name, err.message)
  // shutting down the server gracefully :
  server.close(() => {
    process.exit(1)
  })
})
