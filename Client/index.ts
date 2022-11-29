//? Dependencies

import { app, BrowserWindow } from 'electron'



//? Application Window

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    })

    win.loadURL('https://new.horizons.gg')
}


app.on('ready', () => createWindow())