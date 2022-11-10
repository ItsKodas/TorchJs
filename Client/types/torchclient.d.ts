//? Type Dependencies

import type { ChildProcess } from 'child_process'



//? Type Definitions

export { }


declare global {

    interface TorchClient {

        id: string

        torch: Config['torch']
        instance: Config['instances'][0]
        isConnected: boolean


        client: ChildProcess | null

    }

}