//? Type Dependencies

import { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface PluginPack {
        _id?: ObjectId

        name: string
        enabled: boolean
        community: string
        
        plugins: {
            name: string | undefined
            guid: string
        }[]
    }

}