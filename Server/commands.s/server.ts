//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder, ApplicationCommand, BaseInteraction } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'



//? Command Editor

export const command = () => new SlashCommandBuilder()
    .setName('server')
    .setDescription('Manage Servers on the Network')

    .addSubcommand(subcommand => subcommand
        .setName('enable')
        .setDescription('Enable a Server on the Network')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Enable')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('disable')
        .setDescription('Disable a Server on the Network')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Disable')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('register')
        .setDescription('Register a New Server on the Network')
        .addStringOption(option => option
            .setName('id')
            .setDescription('Server ID (Letters, Numbers, Hyphens and Underscores Only)')
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(32)
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('delete')
        .setDescription('Delete a Server on the Network')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Delete')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )

    .addSubcommand(subcommand => subcommand
        .setName('edit')
        .setDescription('Edit a Server on the Network')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Select a Server to Edit')
            .setRequired(true)
            .setAutocomplete(true)
        )

        .addStringOption(option => option.setName('name').setDescription('Set the Display Name for this Server'))

        .addStringOption(option => option.setName('servername').setDescription('Set the Server Name for this Server'))
        .addStringOption(option => option.setName('worldname').setDescription('Set the World Name for this Server (Overrides the Loaded World Name)'))
        .addStringOption(option => option.setName('world').setDescription('Set the Current World Save'))

        .addIntegerOption(option => option.setName('maxplayers').setDescription('Set the Maximum Number of Players that can join this Server').setMinValue(1).setMaxValue(100))
        .addIntegerOption(option => option.setName('port').setDescription('Set the Listening Port that this Server will use').setMinValue(1).setMaxValue(65535))
        .addStringOption(option => option.setName('password').setDescription('Set a Password for the Server'))
    )


    .addSubcommandGroup(subcommandgroup => subcommandgroup
        .setName('plugins')
        .setDescription('Manage the Plugin Packages for this Server')

        .addSubcommand(subcommand => subcommand
            .setName('add')
            .setDescription('Add a Package to this Server')
            .addStringOption(option => option
                .setName('server')
                .setDescription('Select a Server to add a Package to')
                .setRequired(true)
                .setAutocomplete(true)
            )

            .addStringOption(option => option
                .setName('pack')
                .setDescription('Select a Package to add to this Server')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )

        .addSubcommand(subcommand => subcommand
            .setName('remove')
            .setDescription('Remove a Package from this Server')
            .addStringOption(option => option
                .setName('server')
                .setDescription('Select a Server to remove a Package from')
                .setRequired(true)
                .setAutocomplete(true)
            )

            .addStringOption(option => option
                .setName('pack')
                .setDescription('Select a Package to remove from this Server')
                .setRequired(true)
                .setAutocomplete(true)
            )
        )
    )



export const autocomplete = async (interaction: BaseInteraction) => {

}