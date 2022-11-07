//? Dependencies

import { ChatInputCommandInteraction, CacheType } from "discord.js"

import Update_Commands from '@lib/discord/commands'



//? Command

export default (interaction: ChatInputCommandInteraction<CacheType>) => {

    interaction.reply({ content: '🔃 Refreshing Dynamic Commands, please be patient...', ephemeral: true })

    Update_Commands(interaction.guildId as string, ['*'])
        .then(() => interaction.editReply({ content: `✅ Dynamic Commands have been Successfully Refreshed!` }))
        .catch(err => {
            console.error(err)
            interaction.editReply({ content: `❌ Dynamic Commands Failed to Refresh!` })
        })

}