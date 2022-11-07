//? Type Dependencies

import type { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface Shard {
        _id: ObjectId

        id: string
        name: string
        enabled: boolean
        community: string

        status: ShardStatus
        settings: ShardSettings
    }

    interface ShardStatus {
        state: 'online' | 'offline' | 'idle' | 'starting' | 'stopping'
        heartbeat: Date,
        shouldBeRunning: boolean
    }

    interface ShardSettings {
        servername: string
        worldname: string

        port: number
        maxplayers: number
        password: string | null

        world: string | null
    }
    

}