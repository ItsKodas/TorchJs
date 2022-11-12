//? Exports

export * as enable from './enable'
export * as disable from './disable'
export * as register from './register'
export * as delete from './delete'
export * as edit from './edit'

export * as plugins from './plugins'



//? Dependencies

import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js"

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const data = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Manage Servers on the Network')
    .setDMPermission(false)

    .addSubcommandGroup(Subcommands.plugins.data)

    .addSubcommand(Subcommands.enable.data)
    .addSubcommand(Subcommands.disable.data)
    .addSubcommand(Subcommands.register.data)
    .addSubcommand(Subcommands.delete.data)
    .addSubcommand(Subcommands.edit.data)



//? Response

export const response = (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return

    try {
        Subcommands[interaction.options.getSubcommandGroup() || interaction.options.getSubcommand()](interaction)
    } catch {
        interaction.reply({ content: 'This Sub Command does not exist on the Server!', ephemeral: true })
    }
}