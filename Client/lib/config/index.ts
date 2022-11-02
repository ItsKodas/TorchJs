//? Dependencies

import fs from "fs"



//? Interface

interface Model {
    community: string
    password: string
}



//? Module

const Config: Model = JSON.parse(fs.readFileSync("./config.json", "utf8"))

export default Config