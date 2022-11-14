//? Dependencies

import Config from '@lib/config'
import Discord from "discord.js"

import CommunityManager from "@lib/classes/community"

import DiscoverGuilds, { UpdateGuild } from '@lib/discord/guildUpdates'


const Commands: any = require('../../commands')
const Buttons: any = require('../../interfaces/buttons')



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
                if (_client.application) _client.application.commands.set([

                    Commands.set.data,
                    Commands.server.data,
                    Commands.plugins.data,
                    Commands.config.data

                ]).then(() => console.log('Registered Global Commands!'))


                //? Discover Guilds
                DiscoverGuilds()
                    .then(console.info)
                    .catch(console.error)



                //? Interaction Handler
                _client.on('interactionCreate', interaction => {

                    let path = '../../commands/'

                    try {

                        if (interaction.isChatInputCommand() || interaction.isAutocomplete()) {
                            if (interaction.commandName) path += interaction.commandName
                            if (interaction.options.getSubcommandGroup()) path += ('/' + interaction.options.getSubcommandGroup())
                            if (interaction.options.getSubcommand()) path += ('/' + interaction.options.getSubcommand())
                        }

                        if (interaction.isAutocomplete()) require(path).autocomplete(interaction)
                        if (interaction.isChatInputCommand()) require(path).response(interaction)
                        if (interaction.isButton()) Buttons[interaction.customId.split('.')[0]](interaction, interaction.customId.split('.'))

                    } catch (err) {

                        console.error(err)

                        if (interaction.isAutocomplete()) interaction.respond([{ name: `${path} is missing an autocomplete method!`, value: '.' }])
                        if (interaction.isChatInputCommand() || interaction.isButton()) interaction.reply({ content: 'This Command does not exist on the Server!', ephemeral: true })
                        else console.log(`Interaction "${interaction.id}" does not exist on the Server!`)

                    }

                })


                //? Guilds Updates
                _client.on('guildCreate', (guild) => { UpdateGuild(guild) })
                _client.on('guildDelete', async (guild) => {
                    const Community = new CommunityManager(guild.id)
                    if (!await Community.fetch().catch(() => false)) return console.warn(`Guild (${guild.name} - ${guild.id}) cannot be deleted as it does not exist in the database`)

                    Community.delete()
                        .then(() => console.warn(`Guild Deleted (${guild.name} - ${guild.id})`))
                        .catch(console.error)
                })


                //? Client Presence Update
                function UpdatePresence() { _client.user?.setActivity({ type: Discord.ActivityType.Competing, name: `${_client.guilds.cache.size} Communities` }) }
                setInterval(UpdatePresence, 1000 * 60 * 5), UpdatePresence()

            })
        } else resolve(_client)

    })
}



//? Common Exports

export function Guild(guildId: string): Promise<Discord.Guild> { return new Promise((resolve, reject) => Client().then(async client => resolve(client.guilds.cache.get(guildId) || await client.guilds.fetch(guildId))).catch(reject)) }
export function Channel(guildId: string, channelId: string): Promise<Discord.TextChannel> { return new Promise((resolve, reject) => Guild(guildId).then(async guild => resolve((guild.channels.cache.get(channelId) || await guild.channels.fetch(channelId).catch(reject)) as Discord.TextChannel))) }