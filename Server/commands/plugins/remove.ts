//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import PluginManager from "@lib/classes/plugins"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"

import TorchAPIPlugins from "@lib/torchapi/plugins"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    let _pluginOptions = 0, Guid: string = ''
    if (interaction.options.getString('popular')) _pluginOptions++, Guid = interaction.options.getString('popular') as string
    if (interaction.options.getString('guid')) _pluginOptions++, Guid = interaction.options.getString('guid') as string
    if (interaction.options.getString('local')) _pluginOptions++, Guid = interaction.options.getString('local') as string

    if (_pluginOptions > 1) return interaction.reply({ content: 'You can only use one of the following options per request: `popular`, `guid`, `local`', ephemeral: true })


    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('pack', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })


    if (interaction.options.getString('popular') || interaction.options.getString('guid')) {
        const TorchAPI: any[] = await TorchAPIPlugins()

        const Plugin = TorchAPI.find(plugin => plugin.id == Guid)
        if (!Plugin) return interaction.reply({ content: 'Plugin could not be found!', ephemeral: true })

        Pack.add({ name: Plugin.name, guid: Plugin.id })
            .then(() => {
                interaction.reply({ content: `${Plugin.name} by ${Plugin.author} has been added to ${Pack.name}.`, ephemeral: true })
                Update_Commands(interaction.guildId as string, ['plugins'])
            })
            .catch(err => {
                console.error(err)
                interaction.reply({ content: 'An error occurred while adding the plugin to the pack!', ephemeral: true })
            })
    }

    else {
        Pack.add({ name: undefined, guid: Guid })
            .then(() => {
                interaction.reply({ content: `Local System Plugin has been added to ${Pack.name}.\n\n\`>>> ${Guid}\``, ephemeral: true })
                Update_Commands(interaction.guildId as string, ['plugins'])
            })
            .catch(err => {
                console.error(err)
                interaction.reply({ content: 'An error occurred while adding the plugin to the pack!', ephemeral: true })
            })
    }

}