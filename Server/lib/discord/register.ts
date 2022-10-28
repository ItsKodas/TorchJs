//? Dependencies

import Config from '@lib/config'

import { REST, Routes } from 'discord.js'



//? REST API

const rest = new REST({ version: '10' }).setToken(Config.discord.token)



//? Push Commands

export async function PushCommands(commands: any[], type?: 'global' | 'guild', guildId?: string) {

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands${type == 'guild' && guildId ? `for guild "${guildId}"` : ''}.`)

        const data: any = await rest.put(
            type == 'guild' && guildId ? Routes.applicationGuildCommands(Config.discord.id, guildId) : Routes.applicationCommands(Config.discord.id),
            { body: commands },
        )

        console.log(`Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
        console.error(error)
    }

}