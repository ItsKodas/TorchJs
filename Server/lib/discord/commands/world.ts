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