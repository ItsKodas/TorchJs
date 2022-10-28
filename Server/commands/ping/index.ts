//? Dependencies

import { ChatInputCommandInteraction, CacheType } from "discord.js"

import { Collection } from "@lib/mongodb"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    interaction.reply({ content: 'Pong!', ephemeral: true })

}