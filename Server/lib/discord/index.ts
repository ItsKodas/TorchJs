//? Dependencies

import Config from '@lib/config'
import * as Discord from "discord.js"


import { PushCommands } from "@lib/discord/register"
import GlobalCommands from '@lib/discord/globalCommands'

import * as _commands from '../../commands'
import * as _buttons from '../../interfaces/buttons'

import DiscoverGuilds, { UpdateGuild, DeleteGuild } from '@lib/discord/guildUpdates'


//? Import Renames

const Commands: any = _commands
const Buttons: any = _buttons



//? Client

let _client: Discord.Client

export default function Client(): Promise<Discord.Client> {
    return new Promise((resolve, reject) => {

        if (!_client?.isReady()) {
            _client = new Discord.Client({
                intents: [
                    Discord.GatewayIntentBits.Guilds,
                    Discord.GatewayIntentBits.GuildMembers,
                    Discord.GatewayIntentBits.GuildMessages
                ]
            })

            _client.login(Config.discord.token).catch(reject)

            _client.on('ready', () => {
                console.log(`Logged in as ${_client.user?.tag || '"Unknown"'}`)
                if (_client.user) resolve(_client)
                else reject('Client is not ready!')


                //? Register Global Commands
                PushCommands(GlobalCommands)


                //? Discover Guilds
                DiscoverGuilds()
                    .then(console.info)
                    .catch(console.error)



                //? Interaction Handler
                _client.on('interactionCreate', interaction => {
                    try {
                        if (interaction.isChatInputCommand()) Commands[interaction.commandName](interaction)
                        if (interaction.isButton()) Buttons[interaction.customId.split('.')[0]](interaction, interaction.customId.split('.'))
                    } catch {
                        if (interaction.isChatInputCommand() || interaction.isButton()) interaction.reply({ content: 'This Command does not exist on the Server!', ephemeral: true })
                        else console.log(`Interaction "${interaction.id}" does not exist on the Server!`)
                    }
                })


                //? Guilds Updates
                _client.on('guildCreate', (guild) => { UpdateGuild(guild) })
                _client.on('guildDelete', (guild) => DeleteGuild(guild.id))

            })
        } else resolve(_client)

    })
}



//? Common Exports

export function Guild(guildId: string): Promise<Discord.Guild> { return new Promise((resolve, reject) => Client().then(async client => resolve(client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId))).catch(reject)) }
export function Channel(guildId: string, channelId: string): Promise<Discord.TextChannel> { return new Promise((resolve, reject) => Guild(guildId).then(async guild => resolve((guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(reject)) as Discord.TextChannel))) }