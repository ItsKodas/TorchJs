//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import PluginManager from "@lib/classes/plugins"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"

import TorchAPIPlugins from "@lib/torchapi/plugins"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

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