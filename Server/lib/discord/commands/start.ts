//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'



//? Builder

export default (community: string) => {
    return new Promise(async (resolve, reject) => {

        const Shards = await (await Collection('shards')).find({ community, enabled: true, 'status.shouldBeRunning': false }).toArray() as Shard[]
        let ShardChoices: { name: string, value: string }[] | undefined = Shards.map(shard => ({ name: shard.name == shard.id ? shard.id : `${shard.name} (${shard.id})`, value: shard.id }))

        if (ShardChoices.length <= 0) ShardChoices = undefined


        const Community = await Guild(community)

        const Commands = await Community.commands.fetch()
        const ServerCommandGroup = Commands.find(command => command.name === 'start')

        if (!ServerCommandGroup) return reject(`Start Command Group is not present in ${Community.name} (${Community.id})`)


        ServerCommandGroup.edit(Base(ShardChoices)).then(resolve).catch(reject)

    })
}



export const Base = (servers?: { name: string, value: string }[]) => new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start a Server on the Network')

    .addStringOption(option => option
        .setName('server')
        .setDescription('Select a Server to Start')
        .setRequired(true)
        .setChoices(...servers || [{ name: 'No Servers Currently Online / Available', value: '.' }])
    )