//? Dependencies

import * as Discord from "discord.js"

import Client from '@lib/discord'
import { Collection } from '@lib/mongodb'

import { RegisterBaseCommands } from '@lib/discord/commands'



//? Exports

export default function DiscoverGuilds(): Promise<string> {
    return new Promise(async (resolve, reject) => {

        const client = await Client()
        const Guilds = await client.guilds.fetch()

        const Communities = await Collection('communities')



        Guilds.forEach(guild => {
            const data: Community = {
                id: guild.id,
                name: guild.name,
                icon: guild.iconURL({ size: 256, forceStatic: true }) as string
            }

            Communities.updateOne({ id: data.id }, { $set: data }, { upsert: true })
        })

        resolve(`Discovered ${Guilds.size} Guilds!`)

    })
}


export function UpdateGuild(guild: Discord.Guild): Promise<Community> {
    return new Promise(async (resolve, reject) => {

        const Communities = await Collection('communities')

        const data: Community = {
            id: guild.id,
            name: guild.name,
            icon: guild.iconURL({ size: 256, forceStatic: true }) as string
        }

        await Communities.updateOne({ id: data.id }, { $set: data }, { upsert: true })
            .then(() => {
                RegisterBaseCommands(guild.id)
                console.info(`Added Guild "${data.id}"`)
            })
            .catch(console.error)

        resolve(data)

    })
}


export async function DeleteGuild(guildId: string) {
    const Communities = await Collection('communities')

    Communities.deleteOne({ id: guildId })
        .then(() => console.warn(`Deleted Guild "${guildId}"`))
        .catch(console.error)
}