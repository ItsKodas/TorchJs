//? Dependencies

import GetCommunity from "@lib/mongodb/community"
import Client, { Channel } from "@lib/discord"

import { APIEmbed, JSONEncodable, BaseMessageOptions } from 'discord.js'



//? Alert

export default async (guild: string, embeds: BaseMessageOptions['embeds'], components?: BaseMessageOptions['components']) => {

    const Community = await GetCommunity(guild)
    if (!Community?.alerts?.channel) return

    const channel = await Channel(guild, Community.alerts.channel).catch(() => null)
    if (!channel) return


    let Roles: string[] = []
    let Users: string[] = []
    let Mentions: string

    Community.alerts.roles.forEach(role => { if (role) Roles.push(`<@&${role}>`) })
    Community.alerts.users.forEach(user => { if (user) Users.push(`<@${user}>`) })


    if (Roles.length == 0 && Users.length == 0) Mentions = '@here'
    else Mentions = [...Roles, ...Users].join(' ')


    channel.send({ content: Mentions, embeds, components }).catch(err => console.error(`Failed to Send Alert to ${channel.name} in ${channel.guild.name}:\n${err}`))

}