//? Dependencies

import { SlashCommandBuilder } from 'discord.js'



//? Commands

const Commands = [

    new SlashCommandBuilder()
        .setName('set')
        .setDescription('Modify Essential Setup Configurations for TorchJs')
        .addSubcommand(subcommand => subcommand.setName('code').setDescription('Set the Security Code for your Community')
            .addStringOption(option => option.setName('code').setDescription('Security Code - Should be reasonably secure').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand.setName('next').setDescription('uwu')
            .addStringOption(option => option.setName('munch').setDescription('cock').setRequired(true))
        )



    // new SlashCommandBuilder()
    //     .setName('manage')
    //     .setDescription('Manage Servers on the Network')

    //     .addSubcommandGroup(group => group.setName('world').setDescription('Manage Worlds on the Server')

    //         .addSubcommand(subcommand => subcommand.setName('create').setDescription('Create a new World')
    //             .addStringOption(option => option.setName('server').setDescription('Server to Manage').setRequired(true)
    //                 .addChoices()
    //             )
    //             .addStringOption(option => option.setName('name').setDescription('Name of the World').setRequired(true))
    //         )

    //         .addSubcommand(subcommand => subcommand.setName('delete').setDescription('Delete a World')
    //             .addStringOption(option => option.setName('server').setDescription('Server to Manage').setRequired(true)
    //                 .addChoices()
    //             )
    //             .addStringOption(option => option.setName('name').setDescription('Name of the World').setRequired(true))
    //         )

    //         .addSubcommand(subcommand => subcommand.setName('upload').setDescription('Upload a World to the Server (.zip)')
    //             .addStringOption(option => option.setName('server').setDescription('Server to Manage').setRequired(true)
    //                 .addChoices()
    //             )
    //             .addStringOption(option => option.setName('name').setDescription('Name of the World').setRequired(true))
    //             .addAttachmentOption(option => option.setName('file').setDescription('Compressed World File (.zip)').setRequired(true))
    //         )
    //     ),
]

export default Commands