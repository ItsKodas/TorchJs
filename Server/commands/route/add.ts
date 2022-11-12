//? Dependencies

import Config from "@lib/config"

import { ChatInputCommandInteraction, CacheType, Guild, SlashCommandSubcommandBuilder } from "discord.js"

import TempPage from '@lib/express/temp'



//? Command

export const data = new SlashCommandSubcommandBuilder()




//? Response

export const response = async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Page = new TempPage('Test Page', 'This is a test page', 'test', 'editor')

    Page.initialize()

    interaction.reply(`Temp Page: ${Config.url}/${Page.path}/${Page.uid}`)

}