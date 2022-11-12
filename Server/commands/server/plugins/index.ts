//? Exports

export * as add from './add'
export * as remove from './remove'



//? Dependencies

import { ChatInputCommandInteraction, CacheType, SlashCommandSubcommandGroupBuilder } from "discord.js"

import * as _subcommands from '.'
const Subcommands: any = _subcommands



//? Command

export const data = new SlashCommandSubcommandGroupBuilder()
    .setName('plugins')
    .setDescription('Manage the Plugin Packages for this Server')

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