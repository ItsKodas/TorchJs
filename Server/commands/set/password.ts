//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild } from "discord.js"

import { Collection } from "@lib/mongodb"

import { UpdateGuild } from '@lib/discord/guildUpdates'

import Hash from '@lib/security/hash'



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Password = interaction.options.getString('password')
    if (!Password) return interaction.reply({ content: 'You need to provide a Password!', ephemeral: true })

    const Communities = await Collection('communities')
    const Community = await Communities.findOne({ id: interaction.guildId }) || await UpdateGuild(interaction.guild as Guild)


    Communities.updateOne({ id: Community.id }, { $set: { ...Community, password: Hash(Password) } }, { upsert: true })
        .then(() => interaction.reply({ content: `Community Security Password has been successfully hashed and set to: \`${Password}\``, ephemeral: true }))
        .catch(() => interaction.reply({ content: 'An error occurred while setting the Community Security Password', ephemeral: true }))
}