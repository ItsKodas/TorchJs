//? Type Dependencies

import type { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface ConfigPreset {
        _id: ObjectId

        name: string
        community: string

        file: string | null
        type: 'server' | 'plugin' | 'instance' | 'world'

        session: ConfigSession | null
        variables: ConfigVariable[] | null
        
        data: string | null
    }


    interface ConfigSession {
        id: string
        creationDate: Date
        lastUpdated: Date

        data: string
    }


    interface ConfigVariable {
        id: string
        name: string


    }


}