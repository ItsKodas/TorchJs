//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, SlashCommandSubcommandBuilder } from "discord.js"

import CommunityManager from "@lib/classes/community"

import { UpdateGuild } from '@lib/discord/guildUpdates'



//? Command

export const data = new SlashCommandSubcommandBuilder()
    .setName('password').
    setDescription('Set the Security Password for your Community')

    .addStringOption(option => option
        .setName('password')
        .setDescription('Security Password - Should be reasonably secure')
        .setRequired(true)
    )



//? Response

export const response = async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Password = interaction.options.getString('password')
    if (!Password) return interaction.reply({ content: 'You need to provide a Password!', ephemeral: true })


    const Community = new CommunityManager(interaction.guildId as string)
    if (!await Community.fetch().catch(() => false)) UpdateGuild(interaction.guild as Guild)

    Community.setPassword(Password)
        .then(() => interaction.reply({ content: `Community Security Password has been successfully hashed and set to: \`${Password}\``, ephemeral: true }))
        .catch(() => interaction.reply({ content: 'An error occurred while setting the Community Security Password', ephemeral: true }))

}