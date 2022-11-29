//? Dependencies

import * as React from "react"
import { createRoot } from "react-dom/client"


//? Theme

import { ThemeProvider } from '@mui/material'
import DarkTheme from './components/themes/dark'


//? Stylesheets

import './styles/tailwind.css'



//? Pages

import Setup from './pages/setup'



//? Main Render

const Root = createRoot(document.getElementById('app'))

// @ts-ignore
window.api.config.exists()
    .then((exists: boolean) => {
        if (exists) Root.render(<h1>TO-DO</h1>)
        else Root.render(
            <ThemeProvider theme={DarkTheme}>
                <Setup />
            </ThemeProvider>
        )
    })