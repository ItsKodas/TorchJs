//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ApplicationCommand } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'



//? Command Editor

export default (community: string) => {
    return new Promise(async (resolve, reject) => {

        const Shards = await (await Collection('shards')).find({ community }).toArray() as Shard[]
        const EnabledShards = await (await Collection('shards')).find({ community, enabled: true }).toArray() as Shard[]
        const DisabledShards = await (await Collection('shards')).find({ community, enabled: false }).toArray() as Shard[]

        let ShardChoices: { name: string, value: string }[] | undefined = Shards.map(shard => ({ name: shard.name == shard.id ? shard.id : `${shard.name} (${shard.id})`, value: shard.id }))
        let EnabledShardChoices: { name: string, value: string }[] | undefined = EnabledShards.map(shard => ({ name: shard.name == shard.id ? shard.id : `${shard.name} (${shard.id})`, value: shard.id }))
        let DisabledShardChoices: { name: string, value: string }[] | undefined = DisabledShards.map(shard => ({ name: shard.name == shard.id ? shard.id : `${shard.name} (${shard.id})`, value: shard.id }))
        
        if (ShardChoices.length <= 0) ShardChoices = undefined
        if (EnabledShardChoices.length <= 0) EnabledShardChoices = undefined
        if (DisabledShardChoices.length <= 0) DisabledShardChoices = undefined


        const Community = await Guild(community)

        const Commands = await Community.commands.fetch()
        const ServerCommandGroup = Commands.find(command => command.name === 'server')

        if (!ServerCommandGroup) return reject(`Server Command Group is not present in ${Community.name} (${Community.id})`)


        ServerCommandGroup.edit(Base(ShardChoices, EnabledShardChoices, DisabledShardChoices)).then(resolve).catch(reject)

    })
}



export const Base = (servers?: { name: string, value: string }[], enabledServers?: { name: string, value: string }[], disabledServers?: { name: string, value: string }[]) => new SlashCommandBuilder()
    .setName('server')
    .setDescription('Manage Servers on the Network')

    .addSubcommand(subcommand => subcommand
        .setName('enable')
        .setDescription('Enable a Server on the Network')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Enable')
            .setRequired(true)
            .setChoices(...disabledServers || [{ name: 'No Servers Disabled / Available', value: '.' }])
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('disable')
        .setDescription('Disable a Server on the Network')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Disable')
            .setRequired(true)
            .setChoices(...enabledServers || [{ name: 'No Servers Enabled / Available', value: '.' }])
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setDescription('Delete a Server on the Network')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Delete')
            .setRequired(true)
            .setChoices(...servers || [{ name: 'No Servers Available', value: '.' }])
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('edit')
        .setDescription('Edit a Server on the Network')

        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Edit')
            .setRequired(true)
            .setChoices(...servers || [{ name: 'No Servers Available', value: '.' }])
        )

        .addStringOption(option => option.setName('name').setDescription('Set the Display Name for this Server'))

        .addStringOption(option => option.setName('servername').setDescription('Set the Server Name for this Server'))
        .addStringOption(option => option.setName('worldname').setDescription('Set the World Name for this Server (Overrides the Loaded World Name)'))
        .addStringOption(option => option.setName('world').setDescription('Set the Current World Save'))

        .addIntegerOption(option => option.setName('maxplayers').setDescription('Set the Maximum Number of Players that can join this Server').setMinValue(1).setMaxValue(100))
        .addIntegerOption(option => option.setName('port').setDescription('Set the Listening Port that this Server will use').setMinValue(1).setMaxValue(65535))
        .addStringOption(option => option.setName('password').setDescription('Set a Password for the Server'))
    )