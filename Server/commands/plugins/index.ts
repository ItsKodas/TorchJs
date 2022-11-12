//? Exports

export * as createpack from './createpack'
export * as deletepack from './deletepack'
export * as list from './list'

export * as add from './add'
export * as remove from './remove'



//? Dependencies

import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js"

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const data = new SlashCommandBuilder()
    .setName('plugins')
    .setDescription('Manage and Explore Plugins from TorchAPI')
    .setDMPermission(false)
    
    .addSubcommand(Subcommands.createpack.data)
    .addSubcommand(Subcommands.deletepack.data)
    .addSubcommand(Subcommands.list.data)
    .addSubcommand(Subcommands.add.data)
    .addSubcommand(Subcommands.remove.data)



//? Response

export const response = (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return

    try {
        Subcommands[interaction.options.getSubcommand()](interaction)
    } catch {
        interaction.reply({ content: 'This Sub Command does not exist on the Server!', ephemeral: true })
    }
}