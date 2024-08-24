import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { execSync } from 'child_process';


let mainWindow: Electron.BrowserWindow;
let Store: any

import("electron-store").then((value) => {
  Store = new value.default()
})

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.removeMenu()
  if(process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:4200')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'browser/index.html'))
  }

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
  let scripts = Store.get('scripts', [])
  script.id = uuid()
  scripts.push(script)
  Store.set('scripts', scripts)
  return scripts
})

ipcMain.handle('editScript', (event, script: any) => {
  let scripts = Store.get('scripts', []) as {id:string, title: string, code: string}[]
  scripts.forEach((eachScript) => {
    if (script.id == eachScript.id) {
      eachScript.title = script.title
      eachScript.code = script.code
    }
  })
  Store.set('scripts', scripts)
  return scripts
})

ipcMain.handle('deleteScript', (event, id: string) => {
  let scripts = Store.get('scripts', []) as {id:string, title: string, code: string}[]
  scripts = scripts.filter((script) => script.id != id)
  Store.set('scripts', scripts)
  return scripts
})

ipcMain.handle('executeScript', (event, code: string) => {
  let returnData : { output: string, error: boolean }
  try {
    returnData = { output: execSync(code).toString(), error: false }
  } catch (error: any) {
    returnData = { output: error.message, error: true } 
  }
  return returnData
})