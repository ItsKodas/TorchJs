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

export { default as code } from './code'