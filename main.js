const { app, BrowserWindow } = require('electron')
const path = require('path')
const waitOn = require('wait-on')
const express = require('express')
const cors = require('cors')

const productRoutes = require('./routes/productRoutes')

const server = express()
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(cors())
server.use('/api/products', productRoutes)

// Start the server on port 3001
server.listen(3001, () => {
  console.log('Server is running on port 3001')
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
  // mainWindow.webContents.openDevTools(); // Uncomment this line
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
