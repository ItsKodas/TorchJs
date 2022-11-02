//? Dependencies

import { SlashCommandBuilder } from 'discord.js'



//? Commands

const Commands = [

    new SlashCommandBuilder()
        .setName('set')
        .setDescription('Modify Essential Setup Configurations for TorchJs')
        .setDefaultMemberPermissions(32) //! 32 = Manage Server

        //? Set Community Password
        .addSubcommand(subcommand => subcommand.setName('password').setDescription('Set the Security Password for your Community')
            .addStringOption(option => option.setName('password').setDescription('Security Password - Should be reasonably secure').setRequired(true))
        )
        
        //? Set Alerts Channel
        .addSubcommand(subcommand => subcommand.setName('alerts').setDescription('Set the Alerts Channel for your Network (Only Staff Members Should Have Access to this Channel)')
            .addChannelOption(option => option.setName('channel').setDescription('Channel for Alerts').setRequired(true))
            .addRoleOption(option => option.setName('role1').setDescription('Roles to ping and restrict access to').setRequired(false))
            .addRoleOption(option => option.setName('role2').setDescription('Roles to ping and restrict access to').setRequired(false))
            .addRoleOption(option => option.setName('role3').setDescription('Roles to ping and restrict access to').setRequired(false))

            .addUserOption(option => option.setName('user1').setDescription('Users to ping and restrict access to').setRequired(false))
            .addUserOption(option => option.setName('user2').setDescription('Users to ping and restrict access to').setRequired(false))
            .addUserOption(option => option.setName('user3').setDescription('Users to ping and restrict access to').setRequired(false))
        ),



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