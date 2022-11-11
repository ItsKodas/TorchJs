//? Dependencies

import fs from "fs"



//? Interface

interface Model {

    url: string

    server: {
        port: number
        password?: string
    }

    mongo: {
        uri: string
        db: string
    }

    discord: {
        id: string
        token: string
    }
    
}



//? Module

const Config: Model = JSON.parse(fs.readFileSync("./config.json", "utf8"))

export default Config