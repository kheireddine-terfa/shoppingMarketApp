const { app, BrowserWindow } = require('electron')
const path = require('path')
const express = require('express')
const server = express()
const productRoutes = require('./routes/productRoutes')
const cors = require('cors')
server.use(express.urlencoded())
server.use(express.json())
server.use(cors())
server.use('/api/products', productRoutes) // Use the product routes
//----------------
server.listen(3001, () => {
  console.log('Server is running on port 3001')
})
//----------------
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
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

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
