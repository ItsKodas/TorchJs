//? Dependencies

import { ButtonInteraction, CacheType } from "discord.js"



//? Command

export default (interaction: ButtonInteraction<CacheType>, args: string[]) => {

    interaction.reply({ content: 'Ding!', ephemeral: true })

}