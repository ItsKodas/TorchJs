// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts



//? Dependencies

import { contextBridge, ContextBridge } from "electron"



//? IPC

import './lib/config'



//? Bridge

contextBridge.exposeInMainWorld('client', {
    
})