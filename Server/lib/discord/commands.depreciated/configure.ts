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


        ServerCommandGroup.edit(Base()).then(resolve).catch(reject)

    })
}



export const Base = () => new SlashCommandBuilder()
    .setName('config')
    .setDescription('Manage and Edit Configuration Files to be synced across linked servers')

    .addSubcommandGroup(subcommand => subcommand
        .setName('create')
        .setDescription('Create a New Configuration File')

        .addSubcommand(subcommand => subcommand
            .setName('world')
            .setDescription('Create a New World Configuration File')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Display Name for this Configuration')
                .setRequired(true)
            )
            .addBooleanOption(option => option
                .setName('edit')
                .setDescription('Prepare the Editor for this Configuration after creation')
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName('plugin')
            .setDescription('Create a New Plugin Configuration File')
            .addStringOption(option => option
                .setName('name')
                .setDescription('Display Name for this Configuration')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('filename')
                .setDescription('Filename that will be used for this Configuration')
                .setRequired(true)
                .setChoices(
                    { name: 'Essentials by Torch', value: 'Essentials.cfg' },
                )
            )
            .addBooleanOption(option => option
                .setName('edit')
                .setDescription('Prepare the Editor for this Configuration after creation')
            )
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setDescription('Delete a Plugin Package from your network')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Name of the Plugin Package to Delete')
            .setRequired(true)
            .addChoices({ name: 'No Plugin Packs Available', value: '.' })
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('list')
        .setDescription('List all Plugins in a Package')
        .addStringOption(option => option
            .setName('pack')
            .setDescription('Name of the Plugin Package to List')
            .setRequired(true)
            .addChoices({ name: 'No Plugin Packs Available', value: '.' })
        )
    )


    .addSubcommand(subcommand => subcommand
        .setName('edit')
        .setDescription('Add a Plugin from TorchAPI or the Local Client to a Plugin Package (Up to 30 Plugins per Pack)')

        .addStringOption(option => option
            .setName('pack')
            .setDescription('The Pack you want to add a Plugin to')
            .addChoices({ name: 'No Plugin Packs Available', value: '.' })
            .setRequired(true)
        )

        .addStringOption(option => option
            .setName('popular')
            .setDescription('Popular Plugins from TorchAPI')
            .addChoices({ name: 'Plugins have not yet been Fetched from TorchAPI', value: '.' })
        )

        .addStringOption(option => option
            .setName('guid')
            .setDescription('Add Plugin via GUID from TorchAPI')
        )

        .addStringOption(option => option
            .setName('local')
            .setDescription('Add a Local Plugin Located in the Plugins Directory via GUID from the Manifest')
        )
    )