//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'

import { Request as FetchTorchPlugins } from '@lib/torchapi/plugins'



//? Builder

export const command = () => new SlashCommandBuilder()
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



export const autocomplete = () => {}