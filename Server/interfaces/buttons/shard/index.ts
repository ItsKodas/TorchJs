//? Dependencies

import { ButtonInteraction, CacheType } from "discord.js"

import * as _subargs from '.'
const SubArguments: any = _subargs


//? Command

export default (interaction: ButtonInteraction<CacheType>, args: string[]) => {
    if (!interaction.isButton()) return

    try {
        SubArguments[args[1]](interaction, args)
    } catch {
        interaction.reply({ content: `This Sub Argument does not exist on the Server!\n\`\`\`ts\n${args}\`\`\``, ephemeral: true })
    }
}



//? Subcommands

export { default as cancel } from './cancel'
export { default as register } from './register'