//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import ShardManager from "@lib/classes/shard"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const ShardId = interaction.options.getString('server') as string
    if (ShardId == '.') return interaction.reply({ content: 'There are no servers available.', ephemeral: true })


    const Shard = new ShardManager(interaction.guildId as string, ShardId)
    if (!await Shard.fetch().catch(() => false)) return interaction.reply({ content: 'A server with that ID does not exist!', ephemeral: true })

    Shard.delete()
        .then(() => {
            interaction.reply({ content: `${ShardId} has been successfully deleted from the network!`, ephemeral: true })

            Alert(interaction.guildId as string, true, [
                new EmbedBuilder()
                    .setTitle(`Server "${ShardId}" has been deleted from the Network`)
                    .setDescription(`The server "${ShardId}" has been deleted from the network by ${interaction.user}`)
                    .setColor(Colors.danger)
            ])

            Update_Commands(interaction.guildId as string, ['servers'])
        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: 'An error occurred while deleting the server.', ephemeral: true })
        })

}