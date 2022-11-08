//? Type Dependencies

import { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface ModPack {
        _id: ObjectId

        name: string
        enabled: boolean
        community: string

        mods: ModPackMod[]
    }

    interface ModPackMod {
        id: string
        name: string | undefined
    }

}