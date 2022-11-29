// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts



//? Dependencies

import { contextBridge, ContextBridge } from "electron"



//? IPC

import * as Config from "./client/config"



//? Bridge

contextBridge.exposeInMainWorld('api', {
    config: Config
})