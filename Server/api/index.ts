//? Dependencies

import app from '@lib/express'

import * as Routes from '.'
import * as Middleware from './middleware'



//? Middleware

app.use(Middleware.auth)


//? Routes

app.post('/establish', (req, res) => Routes.establish(req, res))

app.get('/tasks', (req, res) => Routes.tasks(req, res))
app.get('/bucket', (req, res) => Routes.bucket(req, res))



//? Errors

app.all('*', (req, res) => res.status(404).json({ error: 'This API Route does not exist!' }))






//? Route Exports

export { default as establish } from './establish'
export { default as tasks } from './tasks'
export { default as bucket } from './bucket'



//? Initialization Export

export default () => 'API Routes Initialized!'