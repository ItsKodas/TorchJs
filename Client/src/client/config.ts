//? Dependencies

import { ipcRenderer } from "electron"



//? Exports

export const exists = () => ipcRenderer.invoke('check-config').then((res) => console.log(res))