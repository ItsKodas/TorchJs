//? Dependencies

import fs from "fs"

import { ipcMain } from "electron"



//? Exports

export const exists = () => fs.existsSync("config.json")
ipcMain.on('check-config', (event) => event.returnValue = exists())


console.log('Config loaded!')