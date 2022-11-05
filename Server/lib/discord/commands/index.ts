//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'

import Register from '@lib/discord/register'


import Manage from './manage'



//? Builder

export default async (community: string) => {

    const Shards = await (await Collection('shards')).find({ community }).toArray()


    const ShardChoices: { name: string, value: string }[] = Shards.map(shard => ({ name: shard.name, value: shard.id }))



    Register([Manage(ShardChoices)])

}



//? Exports

export * as manage from './manage'