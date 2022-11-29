//? Dependencies

import Config from '@lib/config'

import Query from '@api/standard'

import Client from '@app/client'



//! Initialize Client with Server

(async () => {

    for (const instance of Config.instances) {

        if (!instance.enabled) {
            console.warn(`Skipping '${instance.id}' as it is disabled.`)
            continue
        }


        const client = new Client(instance.id)

        await ConnectInstance(client)
            .then(res => console.info(res))
            .catch(err => console.error(err))

        if (!client.isConnected) return


        await client.start()
            .then(res => console.info(res))
            .catch(err => console.error(err))
    }

})();



async function ConnectInstance(client: Client) {
    return new Promise((resolve, reject) => {

        let attempts = 0

        function Connect() {
            client.connect()
                .then(resolve)
                .catch(err => {
                    if (attempts >= 10) return reject(`Failed to Connect '${client.id}' to the Server after ${attempts} attempts.`)
                    console.error(err, `| Attempt: ${attempts++}`)
                    setTimeout(Connect, 10000)
                })
        }

        Connect()

    })
}