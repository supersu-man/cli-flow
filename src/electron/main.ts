import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { v4 as uuid } from 'uuid';


let mainWindow: Electron.BrowserWindow;
let Store: any

import("electron-store").then((value) => {
  Store = new value.default()
})

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  if(process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:4200')
  } else {
    mainWindow.loadURL(path.join(__dirname, 'browser/index.html'))
  }

  //mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow.destroy()
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

ipcMain.handle('getScripts', () => {
  let scripts = Store.get('scripts', [])
  return scripts
})

ipcMain.handle('addScript', (event, script: any) => {
  console.log(script)
  let scripts = Store.get('scripts', [])
  script.id = uuid()
  scripts.push(script)
  Store.set('scripts', scripts)
  return scripts
})

ipcMain.handle('editScript', (event, script: any) => {
  let scripts = Store.get('scripts', []) as {id:string, title: string, code: string}[]
  scripts.forEach((obj) => {
    if (script.id == obj) {
      obj.title = script.title
      obj.code = script.code
    }
  })
  Store.set('scripts', scripts)
  return scripts
})

ipcMain.handle('deleteScript', (event, id: any) => {
  let scripts = Store.get('scripts', []) as {id:string, title: string, code: string}[]
  scripts = scripts.filter((script) => script.id != id)
  Store.set('scripts', scripts)
  return scripts
})