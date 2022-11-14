//? Exports

export * as add from './create'
export * as remove from './edit'



//? Dependencies

import { ChatInputCommandInteraction, CacheType, SlashCommandBuilder } from "discord.js"

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const data = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Manage and Edit Configurations for your Servers')
    .setDMPermission(false)
    
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