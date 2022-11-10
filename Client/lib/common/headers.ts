//? Dependencies

import Config from "@lib/config"



//? Headers

export const Headers = (id: string) => {
    return {
        'Content-Type': 'application/json',
        community: Config.community.id,
        password: Config.community.password,
        shard: id
    }
}

export default Headers