//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import PluginManager from "@lib/classes/plugins"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    let _pluginOptions = 0
    if (interaction.options.getString('popular')) _pluginOptions++
    if (interaction.options.getString('guid')) _pluginOptions++
    if (interaction.options.getString('local')) _pluginOptions++

    if (_pluginOptions > 1) return interaction.reply({ content: 'You can only use one of the following options per request: `popular`, `guid`, `local`', ephemeral: true })


    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('pack', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })



    Pack.save()
        .then(() => {
            interaction.reply({ content: `Created New Plugin Pack: **${Pack.name}** - \`${Pack._id}\``, ephemeral: true })

            Update_Commands(interaction.guildId as string, ['plugins'])
                .then(res => console.log(res))
                .catch(console.error)
        })
        .catch(error => {
            console.error(error)
            interaction.reply({ content: 'An error occurred while creating the Plugin Pack', ephemeral: true })
        })
}