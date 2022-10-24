//? Dependencies

import { ChatInputCommandInteraction, CacheType } from "discord.js"



//? Command

export default (interaction: ChatInputCommandInteraction<CacheType>) => {

    console.log(interaction.options.getString('code'))

}