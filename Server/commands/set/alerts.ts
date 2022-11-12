//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, SlashCommandSubcommandBuilder } from "discord.js"

import CommunityManager from "@lib/classes/community"

import { UpdateGuild } from '@lib/discord/guildUpdates'

import { EmbedBuilder } from "discord.js"

import * as Colors from '@lib/discord/colors'
import Alert from '@lib/discord/alert'



//? Command

export const data = new SlashCommandSubcommandBuilder()
    .setName('alerts')
    .setDescription('Set the Alerts Channel for your Network (Only Staff Members Should Have Access to this Channel)')

    .addChannelOption(option => option.setName('channel').setDescription('Channel for Alerts').setRequired(true))
    .addRoleOption(option => option.setName('role1').setDescription('Roles to ping and restrict access to').setRequired(false))
    .addRoleOption(option => option.setName('role2').setDescription('Roles to ping and restrict access to').setRequired(false))
    .addRoleOption(option => option.setName('role3').setDescription('Roles to ping and restrict access to').setRequired(false))

    .addUserOption(option => option.setName('user1').setDescription('Users to ping and restrict access to').setRequired(false))
    .addUserOption(option => option.setName('user2').setDescription('Users to ping and restrict access to').setRequired(false))
    .addUserOption(option => option.setName('user3').setDescription('Users to ping and restrict access to').setRequired(false))



//? Response

export const response = async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const Channel = interaction.options.getChannel('channel')
    const Roles = [interaction.options.getRole('role1'), interaction.options.getRole('role2'), interaction.options.getRole('role3')]
    const Users = [interaction.options.getUser('user1'), interaction.options.getUser('user2'), interaction.options.getUser('user3')]

    if (!Channel || Channel.type != 0) return interaction.reply({ content: 'You need to provide a Text Channel!', ephemeral: true })


    const Community = new CommunityManager(interaction.guildId as string)
    if (!await Community.fetch().catch(() => false)) UpdateGuild(interaction.guild as Guild)


    Community.alerts = {
        channel: Channel.id,
        roles: Roles.map(role => role?.id),
        users: Users.map(user => user?.id)
    } as CommunityAlerts


    Community.save()
        .then(() => {
            interaction.reply({ content: `Network Alerts has been successfully set to: ${Channel}`, ephemeral: true })
            Alert(Community.id, true, [
                new EmbedBuilder()
                    .setTitle('🌐 Network Alerts')
                    .setDescription('>>> Network Alerts have been linked to this channel')
                    .setColor(Colors.info)
            ])
        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: 'An error occurred while setting the Community Alerts Channel', ephemeral: true })
        })

}