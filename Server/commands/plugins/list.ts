//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import PluginManager from "@lib/classes/plugins"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('pack', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })

    const Content = Pack.plugins.map((plugin, index) => `${index} | ${plugin.name} | ${plugin.guid}`)

    interaction.reply({ content: `\`\`\`${Content.join('\n')}\`\`\``, ephemeral: true })
    
}