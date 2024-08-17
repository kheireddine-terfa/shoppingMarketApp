const { app, BrowserWindow } = require('electron')
const path = require('path')
const waitOn = require('wait-on')
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

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
dotenv.config({ path: './config.env' }) //read the variables from this file and save them into nodeJS environment variables
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())

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

// Start the server on port 3001
const port = process.env.PORT || 3001
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadURL('http://localhost:3000')
   mainWindow.webContents.openDevTools(); // Uncomment this line
}

app.whenReady().then(() => {
  const opts = {
    resources: ['http://localhost:3000'],
    delay: 1000, // initial delay before checking the resources
    interval: 100, // poll interval for checking resources
    timeout: 30000, // timeout to wait for resources
    window: 1000, // stabilization window
  }

  waitOn(opts, (err) => {
    if (err) {
      console.error('React development server did not start in time:', err)
      app.quit()
      return
    }
    createWindow()
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
