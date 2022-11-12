//? Exports

export * as alerts from './alerts'
export * as password from './password'



//? Dependencies

import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js"

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const data = new SlashCommandBuilder()
    .setName('set')
    .setDescription('Modify Essential Setup Configurations for TorchJs')
    .setDMPermission(false)
    .setDefaultMemberPermissions(32) //! 32 = Manage Server

    .addSubcommand(Subcommands.alerts.data)
    .addSubcommand(Subcommands.password.data)



//? Response

export const response = (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return

    try {
        Subcommands[interaction.options.getSubcommand()](interaction)
    } catch {
        interaction.reply({ content: 'This Sub Command does not exist on the Server!', ephemeral: true })
    }
}