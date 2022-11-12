//? Dependencies

import Discord from "discord.js"

import PluginManager from "@lib/classes/plugins"

import { PluginPacks } from "@lib/common/autocomplete"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('List all Plugins in a Package')
    .addStringOption(option => option
        .setName('pack')
        .setDescription('The Plugin Package to List')
        .setRequired(true)
        .setAutocomplete(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('pack', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })

    const Content = Pack.plugins.map((plugin, index) => `${index} | ${plugin.name} | ${plugin.guid}`)

    interaction.reply({ content: `\`\`\`${Content.join('\n')}\`\`\``, ephemeral: true })

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await PluginPacks(interaction.guildId as string, interaction.options.getFocused()))