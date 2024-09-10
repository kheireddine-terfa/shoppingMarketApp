const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')

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

const server = express()
dotenv.config({ path: './config.env' })

server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())

server.use('/images', express.static(path.join(__dirname, 'public/images')))

server.use('/api', userRoutes)
server.use('/api/products', productRoutes)
server.use('/api/categories', categoryRoutes)
server.use('/api/expenses', expenseRoutes)
server.use('/api/expiration-dates', expirationDateRoutes)
server.use('/api/product-supplies', productSupplyRoutes)
server.use('/api/product-sales', productSaleRoutes)
server.use('/api/sales', saleRoutes)
server.use('/api/suppliers', supplierRoutes)
server.use('/api/supplies', supplyRoutes)

const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
