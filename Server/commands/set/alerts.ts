//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild } from "discord.js"

import { Collection } from "@lib/mongodb"

import { UpdateGuild } from '@lib/discord/guildUpdates'

import { EmbedBuilder } from "discord.js"

import * as Colors from '@lib/discord/colors'
import Alert from '@lib/discord/alert'



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Channel = interaction.options.getChannel('channel')
    const Roles = [interaction.options.getRole('role1'), interaction.options.getRole('role2'), interaction.options.getRole('role3')]
    const Users = [interaction.options.getUser('user1'), interaction.options.getUser('user2'), interaction.options.getUser('user3')]

    if (!Channel || Channel.type != 0) return interaction.reply({ content: 'You need to provide a Text Channel!', ephemeral: true })


    const Communities = await Collection('communities')
    const Community = await Communities.findOne({ id: interaction.guildId }) || await UpdateGuild(interaction.guild as Guild)

    const Data = {
        channel: Channel.id,
        roles: Roles.map(role => role?.id),
        users: Users.map(user => user?.id)
    }

    Communities.updateOne({ id: Community.id }, { $set: { ...Community, alerts: Data } }, { upsert: true })
        .then(() => {
            interaction.reply({ content: `Network Alerts has been successfully set to: ${Channel}`, ephemeral: true })
            Alert(Community.id, [
                new EmbedBuilder()
                    .setTitle('🌐 Network Alerts')
                    .setDescription('>>> Network Alerts have been linked to this channel')
                    .setColor(Colors.info)
            ])
        })
        .catch(() => interaction.reply({ content: 'An error occurred while setting the Community Alerts Channel', ephemeral: true }))
}