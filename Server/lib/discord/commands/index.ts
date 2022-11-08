//? Dependencies

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'


import Update_Server, { Base as ServerBase } from './server'
import Update_World, { Base as WorldBase } from './world'
import Update_Plugins, { Base as PluginsBase } from './plugins'

import Update_Start, { Base as StartBase } from './start'
import Update_Stop, { Base as StopBase } from './stop'
import Update_Restart, { Base as RestartBase } from './restart'



//? Builder

export default (community: string, group: ('*' | 'servers' | 'plugins')[]) => {
    return new Promise(async (resolve, reject) => {

        if (group.includes('*') || group.includes('servers') || group.includes('plugins')) {
            await Update_Server(community).catch(reject)
            await Update_Start(community).catch(reject)
            await Update_Stop(community).catch(reject)
            await Update_Restart(community).catch(reject)
        }

        if (group.includes('*') || group.includes('plugins')) {
            await Update_Plugins(community).catch(reject)
        }

        resolve(`Successfully updated Dynamic Commands for "${community}"`)

    })
}


//? Register Base Commands

export async function RegisterBaseCommands(community: string) {

    const Community = await Guild(community)
    await Community.commands.set([
        ServerBase(),
        WorldBase(),
        PluginsBase(),

        StartBase(),
        StopBase(),
        RestartBase()
    ])
        .catch(console.error)

    await Update_Server(community)
    await Update_Start(community)
    await Update_Stop(community)
    await Update_Restart(community)

    console.info(`Registered Base Commands for (${Community.name} - ${Community.id})`)

}