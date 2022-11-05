//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"



//? Builder

export default (ServerChoices: { name: string, value: string }[]) => new SlashCommandBuilder()
    .setName('manage')
    .setDescription('Manage TorchJs for this Community')

    .addSubcommandGroup(
        new SlashCommandSubcommandGroupBuilder()
            .setName('server')
            .setDescription('Manage Servers on the Network')

            .addSubcommand(subcommand => subcommand
                .setName('enable')
                .setDescription('Enable a Server on the Network')
                .addStringOption(option => option
                    .setName('server_enable')
                    .setDescription('Select a Server to Enable')
                    .setRequired(true)
                    .addChoices(...ServerChoices)
                )
            )

            .addSubcommand(subcommand => subcommand
                .setName('disable')
                .setDescription('Disable a Server on the Network')
                .addStringOption(option => option
                    .setName('server_disable')
                    .setDescription('Select a Server to Disable')
                    .setRequired(true)
                    .addChoices(...ServerChoices)
                )
            )

            .addSubcommand(subcommand => subcommand
                .setName('delete')
                .setDescription('Delete a Server on the Network')
                .addStringOption(option => option
                    .setName('server_delete')
                    .setDescription('Select a Server to Delete')
                    .setRequired(true)
                    .addChoices(...ServerChoices)
                )
            )

            .addSubcommand(subcommand => subcommand
                .setName('edit')
                .setDescription('Edit a Server on the Network')

                .addStringOption(option => option
                    .setName('server_edit')
                    .setDescription('Select a Server to Edit')
                    .setRequired(true)
                    .addChoices(...ServerChoices)
                )

                .addStringOption(option => option.setName('edit_name').setDescription('Set the Display Name for this Server'))
                .addStringOption(option => option.setName('edit_worldname').setDescription('Set the World Name for this Server (Overrides the Loaded World Name)'))

                .addIntegerOption(option => option.setName('edit_maxplayers').setDescription('Set the Maximum Number of Players that can join this Server').setMinValue(1).setMaxValue(100))
                .addIntegerOption(option => option.setName('edit_port').setDescription('Set the Listening Port that this Server will use').setMinValue(1).setMaxValue(65535))
                .addStringOption(option => option.setName('edit_password').setDescription('Set a Password for the Server'))
            )
    )