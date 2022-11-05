//? Type Dependencies

import { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface Shard {
        _id?: ObjectId

        id: string
        name: string
        enabled: boolean
        community: string
        
        status: {
            state: 'online' | 'offline' | 'idle' | 'starting' | 'stopping'
            heartbeat: Date
        }
    }

}