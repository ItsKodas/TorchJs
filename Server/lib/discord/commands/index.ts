//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'

import rawTorchPlugins from '@lib/torchapi/plugins'


import Update_Server, { Base as ServerBase } from './server'
import Update_World, { Base as WorldBase } from './world'
import Update_Plugins, { Base as PluginsBase } from './plugins'

import Update_Start, { Base as StartBase } from './start'
import Update_Stop, { Base as StopBase } from './stop'



//? Builder

export default (community: string, group: 'servers') => {
    return new Promise(async (resolve, reject) => {

        if (group == 'servers') {
            await Update_Server(community).catch(reject)
            await Update_Start(community).catch(reject)
            await Update_Stop(community).catch(reject)
            return resolve(`Successfully updated Server Related Commands for "${community}"`)
        }

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
    ])
        .catch(console.error)

    await Update_Server(community)
    await Update_Start(community)
    await Update_Stop(community)

    console.info(`Registered Base Commands for "${Community.name}" (${Community.id})`)

}