//? Dependencies

import Discord from "discord.js"

import PluginManager from "@lib/classes/plugins"

import { PluginPacks } from "@lib/common/autocomplete"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Remove a Plugin from a Plugin Package')

    .addStringOption(option => option
        .setName('pack')
        .setDescription('The Pack you want to add a Plugin to')
        .setRequired(true)
        .setAutocomplete(true)
    )

    .addIntegerOption(option => option
        .setName('index')
        .setDescription('The Index of the Plugin to Remove (Use "/plugins list" to find the Index)')
        .setRequired(true)

        .setMinValue(0)
        .setMaxValue(20)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('pack', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })


    Pack.remove(interaction.options.getInteger('index', true))
        .then(plugin => {
            interaction.reply({ content: `Successfully Removed ${plugin.name} \`(${plugin.guid})\` from ${Pack.name}!`, ephemeral: true })
        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: `An error occurred while removing the Plugin!\n\n**Details**\n\`${err}\``, ephemeral: true })
        })

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await PluginPacks(interaction.guildId as string, interaction.options.getFocused()))