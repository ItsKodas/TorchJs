//? Dependencies

import Discord from "discord.js"

import PluginManager from "@lib/classes/plugins"

import { PluginPacks } from "@lib/common/autocomplete"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('deletepack')
    .setDescription('Delete a Plugin Package from your network')
    .addStringOption(option => option
        .setName('pack')
        .setDescription('The Plugin Package to Delete')
        .setRequired(true)
        .setAutocomplete(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('pack', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })

    Pack.delete()
        .then(() => {
            interaction.reply({ content: `Deleted Plugin Pack: **${Pack.name}** (\`${Pack._id}\`)`, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new Discord.EmbedBuilder()
                    .setTitle(`Plugin Pack Deleted: __${Pack.name}__`)
                    .setDescription(`Plugin Pack has been deleted by ${interaction.user}`)
                    .setFooter({ text: `GUID: ${Pack._id}` })
                    .setColor(Colors.danger)
            ])

        })
        .catch(error => {
            console.error(error)
            interaction.reply({ content: 'An error occurred while deleting the Plugin Pack', ephemeral: true })
        })
}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await PluginPacks(interaction.guildId as string, interaction.options.getFocused()))