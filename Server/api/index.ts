//? Dependencies

import app from '@lib/express'

import * as Routes from '.'
import * as Middleware from './middleware'



//? Middleware

app.use(Middleware.auth)


//? Routes

app.post('/establish', (req, res) => Routes.establish(req, res))

app.get('/tasks', (req, res) => Routes.tasks(req, res))

app.get('/shard', (req, res) => Routes.shard(req, res))
app.get('/plugins', (req, res) => Routes.plugins(req, res))



//? Errors

app.all('*', (req, res) => res.status(404).json({ error: 'This API Route does not exist!' }))






//? Route Exports

export { default as establish } from './establish'

export { default as tasks } from './tasks'

export { default as shard } from './shard'
export { default as plugins } from './plugins'



//? Initialization Export

export default () => 'API Routes Initialized!'