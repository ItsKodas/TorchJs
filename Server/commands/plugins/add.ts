//? Dependencies

import Discord from "discord.js"

import { Collection } from '@lib/mongodb'

import PluginManager from "@lib/classes/plugins"

import * as Autocomplete from "@lib/common/autocomplete"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Add a Plugin from TorchAPI or the Local Client to a Plugin Package')

    .addStringOption(option => option
        .setName('pack')
        .setDescription('The Pack you want to add a Plugin to')
        .setRequired(true)
        .setAutocomplete(true)
    )

    .addStringOption(option => option
        .setName('torch')
        .setDescription('Add a Plugin from TorchAPI')
        .setAutocomplete(true)
    )

    .addStringOption(option => option
        .setName('local')
        .setDescription('Add a Local Plugin Located in the Plugins Directory via GUID from the Manifest')
    )


//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    let _pluginOptions = 0, Guid: string = ''
    if (interaction.options.getString('torch')) _pluginOptions++, Guid = interaction.options.getString('torch') as string
    if (interaction.options.getString('local')) _pluginOptions++, Guid = interaction.options.getString('local') as string

    if (_pluginOptions > 1) return interaction.reply({ content: 'You can only use __one__ of the following options per request: `torch`, `local`', ephemeral: true })
    if (_pluginOptions == 0) return interaction.reply({ content: 'You need to use __one__ of the following options: `torch`, `local`', ephemeral: true })


    const Pack = new PluginManager(interaction.guildId as string, interaction.options.getString('pack', true))
    if (!await Pack.fetch().catch(() => false)) return interaction.reply({ content: 'Plugin Pack could not be found!', ephemeral: true })



    if (interaction.options.getString('torch')) {

        const TorchAPI = await Collection('torchapi-plugins')
        const Plugin: any = await TorchAPI.findOne({ id: interaction.options.getString('torch') })
        if (!Plugin) return interaction.reply({ content: 'Plugin could not be found!', ephemeral: true })

        Pack.add({ name: Plugin.name, guid: Plugin.id })
            .then(() => {
                interaction.reply({ content: `${Plugin.name} by ${Plugin.author} has been added to ${Pack.name}.`, ephemeral: true })
            })
            .catch(err => {
                console.error(err)
                interaction.reply({ content: `An error occurred while adding the plugin to the pack!\n\n**Details**\n\`${err}\``, ephemeral: true })
            })
    }

    else {
        Pack.add({ name: undefined, guid: Guid })
            .then(() => {
                interaction.reply({ content: `Local System Plugin has been added to ${Pack.name}.\n\n\`>>> ${Guid}\``, ephemeral: true })
            })
            .catch(err => {
                console.error(err)
                interaction.reply({ content: `An error occurred while adding the plugin to the pack!\n\n**Details**\n\`${err}\``, ephemeral: true })
            })
    }

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => {

    if (interaction.options.getFocused(true).name == 'pack') return interaction.respond(await Autocomplete.PluginPacks(interaction.guildId as string, interaction.options.getFocused()))
    if (interaction.options.getFocused(true).name == 'torch') return interaction.respond(await Autocomplete.TorchAPIPlugins(interaction.options.getFocused()))

}