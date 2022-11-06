//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'

import rawTorchPlugins from '@lib/torchapi/plugins'


import Update, { Base as ServerBase } from './server'
import { Base as WorldBase } from './world'
import { Base as PluginsBase } from './plugins'



//? Builder

export default async (community: string) => {

    // await RegisterBaseCommands(community)

}


//? Register Base Commands

export async function RegisterBaseCommands(community: string) {

    const TorchPlugins: any[] = await rawTorchPlugins()
        .then((plugins: any[]) => plugins.sort((a, b) => a.downloads < b.downloads ? 1 : -1))
        .then((plugins: any[]) => plugins.splice(0, 20).map((plugin: any) => ({ name: `${plugin.name} - ${plugin.author} (${plugin.downloads} downloads)`, value: plugin.id })))


    const Community = await Guild(community)
    await Community.commands.set([ServerBase(), WorldBase(), PluginsBase(TorchPlugins)])
        .catch(console.error)

    console.info(`Registered Base Commands for "${Community.name}" (${Community.id})`)

}