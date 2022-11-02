//? Dependencies

import Config from '@lib/config'

import Establish from '@api/establish'



//! Start Up
console.info(`Attempting to Establish a Connection with the Server (${Config.server.host}:${Config.server.port}) using Shard ID '${Config.shard.id}'`)




Establish()