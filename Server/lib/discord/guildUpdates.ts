//? Dependencies

import * as Discord from "discord.js"

import CommunityManager from "@lib/classes/community"

import Client from '@lib/discord'
import { Collection } from '@lib/mongodb'



//? Exports

export default function DiscoverGuilds(): Promise<string> {
    return new Promise(async (resolve, reject) => {

        const client = await Client()
        const Guilds = await client.guilds.fetch()

        const Communities = await Collection('communities')



        Guilds.forEach(async guild => {

            const Community = new CommunityManager(guild.id)
            await Community.fetch().catch(() => console.log(`New Guild (${guild.name} - ${guild.id}) has been added to the database`))

            Community.name = guild.name
            Community.icon = guild.iconURL({ size: 256, forceStatic: true })

            Community.save()
                .then(() => console.info(`Saved Guild (${guild.name} - ${guild.id})`))

        })

        resolve(`Discovered ${Guilds.size} Guilds!`)

    })
}


export function UpdateGuild(guild: Discord.Guild): Promise<Community> {
    return new Promise(async (resolve, reject) => {

        const Community = new CommunityManager(guild.id)
        await Community.fetch().catch(() => {
            console.info(`New Guild (${guild.name} - ${guild.id}) has been added to the database`)
        })

        Community.name = guild.name
        Community.icon = guild.iconURL({ size: 256, forceStatic: true })

        Community.save()
            .then(() => {
                console.log(`Saved ${guild.name} (${guild.id})`)
                resolve(Community)
            })
            .catch(console.error)

    })
}