//? Dependencies

import Mongo from '@lib/mongodb'
import Discord, { Channel } from '@lib/discord'
import API from './api'


import SyncPlugins from '@lib/torchapi/plugins'
import { CycleShards } from '@lib/common/heartbeat'


import Plugins from '@lib/torchapi/plugins'



//? Initialize

Mongo().then(() => {
    SyncPlugins()
    CycleShards()
    setInterval(CycleShards, 1000 * 60 * 5)
})

Discord()

API()