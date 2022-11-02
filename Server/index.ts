//? Dependencies

import Mongo from '@lib/mongodb'
import Discord, { Channel } from '@lib/discord'
import API from './api'


import { CycleShards } from '@lib/common/heartbeat'



//? Initialize

Mongo().then(() => {
    CycleShards()
    setInterval(CycleShards, 1000 * 60 * 5)
})

Discord()

API()