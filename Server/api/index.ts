//? Dependencies

import app from '@lib/express'

import * as Routes from '.'
import * as Middleware from './middleware'



//? Middleware

app.use(Middleware.auth)


//? Routes

app.post('/establish', (req, res) => Routes.establish(req, res))



//? Errors

app.all('*', (req, res) => res.status(404).json({ error: 'This API Route does not exist!' }))






//? Route Exports

export { default as establish } from './establish'



//? Initialization Export

export default () => 'API Routes Initialized!'