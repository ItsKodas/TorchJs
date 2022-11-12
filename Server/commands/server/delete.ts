//? Dependencies

import Discord from "discord.js"

import ShardManager from "@lib/classes/shard"

import { Shards } from '@lib/common/autocomplete'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete a Server on the Network')
    .addStringOption(option => option
        .setName('server')
        .setDescription('Select a Server to Delete')
        .setRequired(true)
        .setAutocomplete(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const ShardId = interaction.options.getString('server') as string


    const Shard = new ShardManager(interaction.guildId as string, ShardId)
    if (!await Shard.fetch().catch(() => false)) return interaction.reply({ content: 'A server with that ID does not exist!', ephemeral: true })

    Shard.delete()
        .then(() => {
            interaction.reply({ content: `${ShardId} has been successfully deleted from the network!`, ephemeral: true })

            Alert(interaction.guildId as string, true, [
                new Discord.EmbedBuilder()
                    .setTitle(`Server "${ShardId}" has been deleted from the Network`)
                    .setDescription(`The server "${ShardId}" has been deleted from the network by ${interaction.user}`)
                    .setColor(Colors.danger)
            ])

        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: 'An error occurred while deleting the server.', ephemeral: true })
        })

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await Shards(interaction.guildId as string, interaction.options.getFocused()))