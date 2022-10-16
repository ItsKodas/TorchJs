//? Dependencies

import { ChatInputCommandInteraction, CacheType } from "discord.js"



//? Command

export default (interaction: ChatInputCommandInteraction<CacheType>) => {

    interaction.reply({ content: 'Pong!', ephemeral: true })

}