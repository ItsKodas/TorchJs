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

    Shards.updateOne({ id: ShardId, community: interaction.guildId }, { $set: { enabled: true } })
        .then(() => {
            interaction.reply({ content: `${ShardId} has been successfully enabled on the network!`, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new EmbedBuilder()
                    .setTitle(`Server "${ShardId}" has been Enabled`)
                    .setDescription(`The server "${ShardId}" has been enabled on the network by ${interaction.user}`)
                    .setColor(Colors.success)
            ])

            Update_ServerRelated(interaction.guildId as string, 'servers')

        })

}