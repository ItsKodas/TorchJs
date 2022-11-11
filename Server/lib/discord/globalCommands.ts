//? Dependencies

import { SlashCommandBuilder } from 'discord.js'



//? Commands

const Commands = [

    new SlashCommandBuilder()
        .setName('refresh')
        .setDescription('Refreshes all Dynamic Commands for this Server')
        .setDMPermission(false),

        
    new SlashCommandBuilder()
        .setName('set')
        .setDescription('Modify Essential Setup Configurations for TorchJs')
        .setDMPermission(false)
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


    new SlashCommandBuilder()
        .setName('route')
        .setDescription('Manage Routes for the Web Server (DEV)')
        .setDMPermission(false)
        .setDefaultMemberPermissions(32)

        .addSubcommand(subcommand => subcommand.setName('add').setDescription('Add a Route to the Web Server'))
        .addSubcommand(subcommand => subcommand.setName('remove').setDescription('Remove a Route from the Web Server'))
]

export default Commands