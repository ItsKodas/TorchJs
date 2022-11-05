//? Dependencies

import Mongo from '@lib/mongodb'
import Discord, { Channel } from '@lib/discord'
import API from './api'


import { CycleShards } from '@lib/common/heartbeat'


import Commands from '@lib/discord/commands'



//? Initialize

Mongo().then(() => {
    CycleShards()
    setInterval(CycleShards, 1000 * 60 * 5)
})

Discord().then(() => {
    Commands('610606066451087370')
})

API()