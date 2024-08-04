import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';

let mainWindow: Electron.BrowserWindow;

function createWindow() {
  // Create the browser window.
  console.log(path.join(__dirname, 'preload.js'))
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
        preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.loadURL('http://localhost:4200')
//   mainWindow.loadURL(path.join(__dirname, 'browser/index.html'))

  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    //mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.handle('getPaths', () => {
    return "hello"
})