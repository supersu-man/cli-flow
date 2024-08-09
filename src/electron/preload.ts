import { contextBridge, ipcRenderer } from 'electron'
contextBridge.exposeInMainWorld('api', {
    getScripts: () => ipcRenderer.invoke('getScripts'),
    addScript: (script: { title: string, code: string }) => ipcRenderer.invoke('addScript', script),
    editScript: (script: { id:string, title: string, code: string }) => ipcRenderer.invoke('editScript', script),
    deleteScript: (id: string) => ipcRenderer.invoke('deleteScript', id),
    executeScript: (code: string) => ipcRenderer.invoke('executeScript', code),
})