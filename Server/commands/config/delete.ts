//? Dependencies

import Config from '@lib/config'

import Discord from "discord.js"

import { Collection } from '@lib/mongodb'

import ConfigManager from "@lib/classes/configuration"

import * as Autocomplete from "@lib/common/autocomplete"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('delete')
    .setDescription('Delete a Configuration')

    .addStringOption(option => option
        .setName('configuration')
        .setDescription('The Configuration you want to delete')
        .setRequired(true)
        .setAutocomplete(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Configuration = new ConfigManager(interaction.guildId as string, null, interaction.options.getString('configuration') as string)
    if (!await Configuration.fetch().catch(() => false)) return interaction.reply({ content: 'A Configuration with that ID does not exist!', ephemeral: true })

    Configuration.delete()
        .then(() => interaction.reply({ content: 'The Configuration has been deleted!', ephemeral: true }))
        .catch(err => interaction.reply({ content: `An Error occurred while deleting the Configuration!\n\n**Details:** \`${err}\``, ephemeral: true }))

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await Autocomplete.Configurations(interaction.guildId as string, interaction.options.getFocused()))