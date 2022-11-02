//? Dependencies

import Config from "@lib/config"



//? Headers

export default {
    'Content-Type': 'application/json',
    community: Config.shard.community,
    password: Config.shard.password,
    shard: Config.shard.id
}