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

    torch: {
        directory: string
        executable: string
    }

    instance: {
        directory: string
    }
}



//? Module

const _config: any = JSON.parse(fs.readFileSync(process.argv[2] || "./config.json", "utf8"))
const Config: Model = {
    uri: `${_config.server.secure ? 'https' : 'http'}://${_config.server.host}:${_config.server.port}`,
    ..._config
}

export default Config