const { app, BrowserWindow } = require('electron')
const path = require('path')
const waitOn = require('wait-on')

function createWindow() {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadURL('http://localhost:3000')
  // mainWindow.webContents.openDevTools() // Optional: Uncomment if needed
}

app.whenReady().then(() => {
  const opts = {
    resources: ['http://localhost:3000'],
    delay: 1000,
    interval: 100,
    timeout: 30000,
    window: 1000,
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
