import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { execSync, spawn, ChildProcessWithoutNullStreams } from 'child_process';


let mainWindow: Electron.BrowserWindow;
let Store: any
let child: ChildProcessWithoutNullStreams

import("electron-store").then((value) => {
  Store = new value.default()
})

const assetsPath = process.argv.includes('--dev') ? '../src/assets' : 'browser/assets'

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, assetsPath + '/icon.png')
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

  mainWindow.webContents.on('did-finish-load', function() {
    if(process.platform == "win32") {
      child = spawn("cmd");
    } else {
      child = spawn("bash");
    }
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(data: string) {
      mainWindow.webContents.send('scriptOutput', { output: data, error: false })
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on("data", function(data: string) {
      mainWindow.webContents.send('scriptOutput', { output: data, error: true })
    })
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
  child.stdin.write(code+"\n")
})