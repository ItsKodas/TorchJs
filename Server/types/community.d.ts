//? Type Dependencies

import { ObjectId } from 'mongodb'



//? Type Definitions

export { }


declare global {

    interface Community {
        _id: ObjectId

        id: string
        name: string
        icon: string | null

        password?: CommunityPassword
        alerts?: CommunityAlerts
    }

    interface CommunityPassword {
        hash: string
        salt: string
    }

    interface CommunityAlerts {
        channel: string
        roles: [
            string | undefined,
            string | undefined,
            string | undefined
        ]
        users: [
            string | undefined,
            string | undefined,
            string | undefined
        ]
    }

}