//? Exports

export * as add from './create'
export * as edit from './edit'
export * as delete from './delete'



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
    .addSubcommand(Subcommands.edit.data)
    .addSubcommand(Subcommands.delete.data)



//? Response

export const response = (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return

    try {
        Subcommands[interaction.options.getSubcommand()](interaction)
    } catch {
        interaction.reply({ content: 'This Sub Command does not exist on the Server!', ephemeral: true })
    }
}