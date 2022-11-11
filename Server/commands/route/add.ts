//? Dependencies

import Config from "@lib/config"

import { ChatInputCommandInteraction, CacheType, Guild } from "discord.js"

import TempPage from '@lib/express/temp'



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Page = new TempPage('Test Page', 'This is a test page', 'test', 'editor')

    Page.initialize()

    interaction.reply(`Temp Page: ${Config.url}/${Page.path}/${Page.uid}`)

}