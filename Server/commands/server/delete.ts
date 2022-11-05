//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import { Collection } from "@lib/mongodb"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const ShardId = interaction.options.getString('server')

    const Shards = await Collection('shards')

    Shards.deleteOne({ id: ShardId, community: interaction.guildId })
        .then(() => {
            interaction.reply({ content: `${ShardId} has been successfully deleted from the network!`, ephemeral: true })
            
            Alert(interaction.guildId as string, [
                new EmbedBuilder()
                .setTitle(`Server "${ShardId}" Deleted from the Network`)
                .setDescription(`The server "${ShardId}" has been deleted from the network by ${interaction.user.tag}`)
                .setColor(Colors.danger)
            ])
            
        })

}