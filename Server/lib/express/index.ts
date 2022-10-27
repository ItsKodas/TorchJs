//? Dependencies

import Config from '@lib/config'

import express from 'express'
import bodyParser from 'body-parser'



//? Server

const app = express()

app.set('trust proxy', 'loopback')
app.listen(Config.server.port, () => console.log(`Server is listening on port ${Config.server.port}`))

app.use(bodyParser.json({ type: 'application/json' }))


export default app