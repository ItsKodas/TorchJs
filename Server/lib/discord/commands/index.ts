//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'


import _server from './server'
import _world from './world'



//? Builder

export default async (community: string) => {

    const Shards = await (await Collection('shards')).find({ community }).toArray()


    const ShardChoices: { name: string, value: string }[] = Shards.map(shard => ({ name: shard.name, value: shard.id }))


    const Community = await Guild(community)
    Community.commands.set([_server(ShardChoices), _world(ShardChoices)])

}