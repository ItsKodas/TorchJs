import { ThemeProvider, createTheme } from '@mui/material/styles'
import * as colors from '@mui/material/colors'

export default createTheme({
    palette: {
        mode: 'light',
        primary: colors.orange,
        secondary: colors.pink,
        error: colors.red,
        warning: colors.amber,
        info: colors.blue,
        success: colors.green
    },

    typography: {

        // fontFamily: [
        //     'IBM Plex Sans',
        //     '-apple-system',
        //     'BlinkMacSystemFont',
        //     'Segoe UI',
        //     'Roboto',
        //     'Helvetica Neue',
        //     'Arial',
        //     'sans-serif',
        //     "Apple Color Emoji",
        //     "Segoe UI Emoji",
        //     "Segoe UI Symbol"
        // ].join(','),

        button: {
            textTransform: 'none'
        }
    }
})