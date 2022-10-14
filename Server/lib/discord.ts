//? Dependencies

import Config from '@lib/config'
import * as Discord from "discord.js"



//? Client

let _client: Discord.Client

export default function Client(): Promise<Discord.Client> {
    return new Promise((resolve, reject) => {

        if (!_client?.isReady()) {
            _client = new Discord.Client({
                intents: [
                    Discord.Intents.FLAGS.GUILDS,
                    Discord.Intents.FLAGS.GUILD_MEMBERS,
                    Discord.Intents.FLAGS.GUILD_MESSAGES,
                    Discord.Intents.FLAGS.GUILD_PRESENCES
                ]
            })

            _client.login(Config.discord.token).catch(reject)

            _client.on('ready', () => {
                console.log(`Logged in as ${_client.user?.tag || '"Unknown"'}`)
                if (_client.user) resolve(_client)
                else reject('Client is not ready!')
            })
        } else resolve(_client)

    })
}



//? Common Exports

export function Guild(guildId: string): Promise<Discord.Guild> { return new Promise((resolve, reject) => Client().then(async client => resolve(client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId))).catch(reject)) }
export function Channel(guildId: string, channelId: string): Promise<Discord.TextChannel> { return new Promise((resolve, reject) => Guild(guildId).then(async guild => resolve((guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(reject)) as Discord.TextChannel))) }