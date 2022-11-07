//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import { Collection } from "@lib/mongodb"

import Update_ServerRelated from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const ShardId = interaction.options.getString('server')
    if (ShardId == '.') return interaction.reply({ content: 'There are no servers available.', ephemeral: true })

    const Shards = await Collection('shards')
    const Shard = await Shards.findOne({ id: ShardId, community: interaction.guildId }) as Shard

    if (!Shard) return interaction.reply({ content: 'This server is not registered on the network.', ephemeral: true })


    const Data: Shard = {
        ...Shard as Shard,

        name: interaction.options.getString('name') as string || Shard.name,

        settings: {
            servername: interaction.options.getString('servername') as string || Shard.settings.servername,
            worldname: interaction.options.getString('worldname') as string || Shard.settings.worldname,

            port: interaction.options.getInteger('port') as number || Shard.settings.port,
            maxplayers: interaction.options.getInteger('maxplayers') as number || Shard.settings.maxplayers,
            password: interaction.options.getString('password') as string || Shard.settings.password,

            world: interaction.options.getString('world') as string || Shard.settings.world
        }

    }

    console.table(Data)


    Shards.updateOne({ id: ShardId, community: interaction.guildId }, { $set: Data })
        .then(() => {
            interaction.reply({ content: `${ShardId} has been successfully updated on the network!\n\`\`\`json\n${JSON.stringify(Data, null, '\t')}\`\`\``, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new EmbedBuilder()
                    .setTitle(`Server "${ShardId}" settings have been Updated`)
                    .setDescription(`The server "${ShardId}" has been updated by ${interaction.user}`)
                    .setColor(Colors.success)
                    .setFields([
                        { name: 'Before', value: `\`\`\`json\n${JSON.stringify(Shard, null, '\t')}\`\`\`` },
                        { name: 'After', value: `\`\`\`json\n${JSON.stringify(Data, null, '\t')}\`\`\`` }
                    ])
            ])

            Update_ServerRelated(interaction.guildId as string, 'servers')

        })

}