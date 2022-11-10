//? Dependencies

import fs from "fs"



//? Module

const _config: any = JSON.parse(fs.readFileSync(process.argv[2] || "./config.json", "utf8"))
const Config: Config = {
    uri: `${_config.server.secure ? 'https' : 'http'}://${_config.server.host}:${_config.server.port}`,
    ..._config
}

export default Config