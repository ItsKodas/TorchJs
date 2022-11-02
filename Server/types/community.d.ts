//? Type Dependencies

import { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface Community {
        _id?: ObjectId

        id: string
        name: string
        icon: string

        password?: {
            hash: string
            salt: string
        }

        alerts?: {
            channel: string
            roles: [
                string,
                string,
                string
            ]
            users: [
                string,
                string,
                string
            ]
        }
    }

}