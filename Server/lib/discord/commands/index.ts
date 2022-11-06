//? Dependencies

import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'


import Update, { Base as ServerBase } from './server'
import { Base as WorldBase } from './world'



//? Builder

export default async (community: string) => {

    // await RegisterBaseCommands(community)

}


//? Register Base Commands

export async function RegisterBaseCommands(community: string) {

    const Community = await Guild(community)
    await Community.commands.set([ServerBase(), WorldBase()])

    console.info(`Registered Base Commands for "${Community.name}" (${Community.id})`)

}