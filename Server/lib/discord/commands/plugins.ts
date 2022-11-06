//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"



//? Builder

export default (ServerChoices: { name: string, value: string }[]) => new SlashCommandBuilder()
    .setName('world')
    .setDescription('Manage Worlds on the Network')

    .addSubcommand(subcommand => subcommand
        .setName('create')
        .setDescription('Create a New World Save on the Network')
        .addStringOption(option => option.setName('name').setDescription('Name of the World Save').setRequired(true))
    )

    .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setDescription('Delete a World Save from the Network')
        .addStringOption(option => option.setName('name').setDescription('Name of the World Save').setRequired(true))
    )

    .addSubcommand(subcommand => subcommand
        .setName('upload')
        .setDescription('Upload a World Save to the Network')
        .addAttachmentOption(option => option.setName('zip').setDescription('ZIPPED World Save to Upload to the Network').setRequired(true))
    )



export const Base = (plugins: any[]) => new SlashCommandBuilder()
    .setName('plugins')
    .setDescription('Manage and Explore Plugins from TorchAPI')

    .addSubcommand(subcommand => subcommand
        .setName('createpack')
        .setDescription('Create a New Plugin Package to link to your servers')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Name of the World Save')
            .setRequired(true)
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('deletepack')
        .setDescription('Delete a Plugin Package from your network')
        .addStringOption(option => option
            .setName('name')
            .setDescription('Name of the World Save')
            .setRequired(true)
            .addChoices({ name: 'No Worlds Available', value: '.' })
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('add')
        .setDescription('Add a Plugin from TorchAPI to a Plugin Package')
        
        .addStringOption(option => option
            .setName('popular')
            .setDescription('Popular Plugins from TorchAPI')
            .addChoices(...plugins)
        )

        .addStringOption(option => option
            .setName('guid')
            .setDescription('Add Plugin via GUID from TorchAPI')
        )
    )