//? Dependencies

import Config from '@lib/config'

import express from 'express'
import bodyParser from 'body-parser'



//? Server

const app = express()

app.set('trust proxy', 'loopback')
app.set('view engine', 'ejs')

app.listen(Config.server.port, () => console.log(`Server is listening on port ${Config.server.port}`))

app.use(express.static('public'))
app.use(bodyParser.json({ type: 'application/json' }))


app.get('/', (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${Config.discord.id}&permissions=0&scope=bot%20applications.commands`)
})


app.get('/editor', (req, res) => {

    const data = {
        title: 'Editor',
        description: 'Create your own commands for your Discord bot',
        component: 'edit'
    }

    res.render('document', data, (err, html) => {
        if (err) return res.render('document', { component: 'error', error: err })
        else return html
    })

})


export default app