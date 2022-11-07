//? Dependencies

import { ChatInputCommandInteraction, CacheType } from "discord.js"

import * as _subcommands from '.'
const Subcommands: any = _subcommands


//? Command

export default (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return

    try {
        Subcommands[interaction.options.getSubcommand()](interaction)
    } catch {
        interaction.reply({ content: 'This Sub Command does not exist on the Server!', ephemeral: true })
    }
}



//? Subcommands

export { default as enable } from './enable'
export { default as disable } from './disable'
export { default as register } from './register'
export { default as delete } from './delete'
export { default as edit } from './edit'