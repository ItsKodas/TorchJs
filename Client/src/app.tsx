//? Dependencies

import * as React from "react"
import { createRoot } from "react-dom/client"

import { ipcRenderer } from "electron"



//? Stylesheets

import './styles/tailwind.css'



//? Pages

// import Setup from './pages/setup'



//? Main Render

const Root = createRoot(document.getElementById('app'))

ipcRenderer.send('config-check')

Root.render(<div>Hello uwu</div>)