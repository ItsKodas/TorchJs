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

        discord: ShardDiscord

        status: ShardStatus
        settings: ShardSettings

        plugins: ShardPlugins[]
        mods: ModPack[]
    }

    interface ShardDiscord {
        notifications: {     

            public: {
                enabled: boolean
                channel: string | null
                types: ('all' | 'important' | 'none' | 'crashes' | 'errors' | 'warnings' | 'status' | 'player-join' | 'player-leave')[]
            }

            admin: {
                enabled: boolean
                channel: string | null
                types: ('all' | 'important' | 'none' | 'crashes' | 'errors' | 'warnings' | 'status' | 'player-join' | 'player-leave')[]
            }

        }
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


    interface ShardPlugins {
        guid: string
        name: string
    }


}