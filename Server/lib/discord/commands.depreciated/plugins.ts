//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'

import { Request as FetchTorchPlugins } from '@lib/torchapi/plugins'



//? Builder

export default (community: string) => {
    return new Promise(async (resolve, reject) => {

        const PluginPacks = await (await Collection('plugins')).find({ community, enabled: true }).toArray() as PluginPack[]

        let PluginPackChoices: { name: string, value: string }[] | undefined = PluginPacks.map(pack => ({ name: `${pack.name} | (${(pack._id)})`, value: pack._id.toString() }))

        if (PluginPackChoices.length <= 0) PluginPackChoices = undefined



        const PopularPlugins: any[] = await FetchTorchPlugins()
            .then((plugins: any[]) => plugins.sort((a, b) => a.downloads < b.downloads ? 1 : -1))
            .then((plugins: any[]) => plugins.slice(0, 20).map((plugin: any) => ({ name: `${plugin.name} - ${plugin.author} (${plugin.downloads} downloads)`, value: plugin.id })))


        const Community = await Guild(community)

        const Commands = await Community.commands.fetch()
        const ServerCommandGroup = Commands.find(command => command.name === 'plugins')

        if (!ServerCommandGroup) return reject(`Plugins Command Group is not present in ${Community.name} (${Community.id})`)


        ServerCommandGroup.edit(Base(PopularPlugins, PluginPackChoices)).then(resolve).catch(reject)

    })
}



export const Base = (popular?: { name: string, value: string }[], packs?: { name: string, value: string }[]) => new SlashCommandBuilder()
    .setName('plugins')
    .setDescription('Manage and Explore Plugins from TorchAPI (Up to 25 Packs per Community)')

    .addSubcommand(subcommand => subcommand
        .setName('createpack')
        .setDescription('Create a New Plugin Package to link to your servers')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Name of the Plugin Package to Create')
            .setRequired(true)
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('deletepack')
        .setDescription('Delete a Plugin Package from your network')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Name of the Plugin Package to Delete')
            .setRequired(true)
            .addChoices(...packs || [{ name: 'No Plugin Packs Available', value: '.' }])
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('list')
        .setDescription('List all Plugins in a Package')
        .addStringOption(option => option
            .setName('pack')
            .setDescription('Name of the Plugin Package to List')
            .setRequired(true)
            .addChoices(...packs || [{ name: 'No Plugin Packs Available', value: '.' }])
        )
    )


    .addSubcommand(subcommand => subcommand
        .setName('add')
        .setDescription('Add a Plugin from TorchAPI or the Local Client to a Plugin Package (Up to 30 Plugins per Pack)')

        .addStringOption(option => option
            .setName('pack')
            .setDescription('The Pack you want to add a Plugin to')
            .addChoices(...packs || [{ name: 'No Plugin Packs Available', value: '.' }])
            .setRequired(true)
        )

        .addStringOption(option => option
            .setName('torch')
            .setDescription('Add Plugin from TorchAPI')
            .setAutocomplete(true)
        )

        .addStringOption(option => option
            .setName('local')
            .setDescription('Add a Local Plugin Located in the Plugins Directory via GUID from the Manifest')
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('remove')
        .setDescription('Remove a Plugin from a Plugin Package')

        .addStringOption(option => option
            .setName('pack')
            .setDescription('The Pack you want to add a Plugin to')
            .addChoices(...packs || [{ name: 'No Plugin Packs Available', value: '.' }])
            .setRequired(true)
        )

        .addIntegerOption(option => option
            .setName('index')
            .setDescription('The Index of the Plugin to Remove (Use "/plugins list" to find the Index)')
            .setRequired(true)

            .setMinValue(0)
            .setMaxValue(20)
        )
    )