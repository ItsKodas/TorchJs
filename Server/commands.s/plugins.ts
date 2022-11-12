//? Dependencies

import { BaseInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'

import { Request as FetchTorchPlugins } from '@lib/torchapi/plugins'



//? Builder

export const command = () => new SlashCommandBuilder()
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
            .setAutocomplete(true)
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('list')
        .setDescription('List all Plugins in a Package')
        .addStringOption(option => option
            .setName('pack')
            .setDescription('Name of the Plugin Package to List')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )


    .addSubcommand(subcommand => subcommand
        .setName('add')
        .setDescription('Add a Plugin from TorchAPI or the Local Client to a Plugin Package (Up to 30 Plugins per Pack)')

        .addStringOption(option => option
            .setName('pack')
            .setDescription('The Pack you want to add a Plugin to')
            .setRequired(true)
            .setAutocomplete(true)
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
            .setRequired(true)
            .setAutocomplete(true)
        )

        .addIntegerOption(option => option
            .setName('index')
            .setDescription('The Index of the Plugin to Remove (Use "/plugins list" to find the Index)')
            .setRequired(true)

            .setMinValue(0)
            .setMaxValue(20)
        )
    )



export const autocomplete = async (interaction: BaseInteraction) => {

}