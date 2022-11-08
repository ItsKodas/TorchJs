//? Type Dependencies

import { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface PluginPack {
        _id: ObjectId

        name: string
        enabled: boolean
        community: string

        plugins: PluginPackPlugin[]
    }

    interface PluginPackPlugin {
        guid: string
        name: string | undefined
    }

}