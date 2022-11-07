//? Dependencies

import CommunityManager from "@lib/classes/community"

import Client, { Channel } from "@lib/discord"

import { APIEmbed, JSONEncodable, BaseMessageOptions } from 'discord.js'



//? Alert

export default async (guildId: string, ping: boolean, embeds: BaseMessageOptions['embeds'], components?: BaseMessageOptions['components']) => {

    const Community = new CommunityManager(guildId)
    if (!await Community.fetch().catch(() => false)) return

    if (!Community.alerts?.channel) return

    const channel = await Channel(guildId, Community.alerts.channel).catch(() => null)
    if (!channel) return


    let Roles: string[] = []
    let Users: string[] = []
    let Mentions: string

    Community.alerts.roles.forEach(role => { if (role) Roles.push(`<@&${role}>`) })
    Community.alerts.users.forEach(user => { if (user) Users.push(`<@${user}>`) })


    if (Roles.length == 0 && Users.length == 0) Mentions = '@here'
    else Mentions = [...Roles, ...Users].join(' ')


    channel.send({ content: ping ? Mentions : undefined, embeds, components }).catch(err => console.error(`Failed to Send Alert to ${channel.name} in ${channel.guild.name}:\n${err}`))

}