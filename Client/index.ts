//? Dependencies

import Config from '@lib/config'

import Query from '@api/standard'

import PrepareServer from '@lib/torch/prepare'



//! Initialize Client with Server
console.info(`Attempting to Establish a Connection with the Server (${Config.server.host}:${Config.server.port}) using Shard ID '${Config.shard.id}'`)

const ConnectToServer = () => {
    Query('establish', 'POST')
        .then((res: any) => {
            if (res.status != 200) return console.warn(res.message)
            console.info(res.message)

            clearInterval(Connection)

            PrepareServer()
        })
        .catch(err => console.error(err))
}

const Connection = setInterval(ConnectToServer, 15000)
ConnectToServer()