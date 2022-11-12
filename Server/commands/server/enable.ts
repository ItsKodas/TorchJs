//? Dependencies

import Discord from "discord.js"

import ShardManager from "@lib/classes/shard"

import { Shards } from '@lib/common/autocomplete'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('enable')
    .setDescription('Enable a Server on the Network')
    .addStringOption(option => option
        .setName('server')
        .setDescription('Select a Server to Enable')
        .setRequired(true)
        .setAutocomplete(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const ShardId = interaction.options.getString('server') as string


    const Shard = new ShardManager(interaction.guildId as string, ShardId)
    if (!await Shard.fetch().catch(() => false)) return interaction.reply({ content: 'A server with that ID does not exist!', ephemeral: true })

    Shard.enabled = true

    Shard.save()
        .then(() => {
            interaction.reply({ content: `${ShardId} has been successfully enabled on the network!`, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new Discord.EmbedBuilder()
                    .setTitle(`Server "${ShardId}" has been Enabled`)
                    .setDescription(`The server "${ShardId}" has been enabled on the network by ${interaction.user}`)
                    .setColor(Colors.success)
            ])

        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: 'An error occurred while enabling the server.', ephemeral: true })
        })

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await Shards(interaction.guildId as string, interaction.options.getFocused(), 'disabled'))