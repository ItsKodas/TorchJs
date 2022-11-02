//? Dependencies

import fs from "fs"



//? Interface

interface Model {
    uri: string

    server: {
        host: string
        port: number
        secure: boolean
    }

    shard: {
        id: string
        community: string
        password: string
    }
}



//? Module

const _config: any = JSON.parse(fs.readFileSync("./config.json", "utf8"))
const Config: Model = {
    uri: `${_config.server.secure ? 'https' : 'http'}://${_config.server.host}:${_config.server.port}`,
    ..._config
}

export default Config