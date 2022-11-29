//? Type Dependencies

import type { ChildProcess } from 'child_process'



//? Type Definitions

export { }


declare global {

    interface Config {

        uri: string

        server: {
            host: string
            port: number
            secure: boolean
        }

        community: {
            id: string
            password: string
        }

        torch: {
            directory: string
            executable: string
        }

        instances: {
            id: string
            directory: string
            enabled: boolean
        }[]

    }

}