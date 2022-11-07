//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import PluginManager from "@lib/classes/plugins"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('name', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })

    Pack.delete()
        .then(() => {
            interaction.reply({ content: `Deleted Plugin Pack: **${Pack.name}** (\`${Pack._id}\`)`, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new EmbedBuilder()
                    .setTitle(`Plugin Pack Deleted: __${Pack.name}__`)
                    .setDescription(`Plugin Pack has been deleted by ${interaction.user}`)
                    .setFooter({ text: `GUID: ${Pack._id}` })
                    .setColor(Colors.danger)
            ])

            Update_Commands(interaction.guildId as string, ['plugins'])
        })
        .catch(error => {
            console.error(error)
            interaction.reply({ content: 'An error occurred while deleting the Plugin Pack', ephemeral: true })
        })
}