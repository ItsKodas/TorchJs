//? Dependencies

import Mongo from '@lib/mongodb'
import Discord from '@lib/discord'
import Routes from './routes'



//? Initialize

Mongo()
Discord()
Routes()