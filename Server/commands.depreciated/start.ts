//? Dependencies

import { BaseInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'



//? Builder

export const command = () => new SlashCommandBuilder()
    .setName('start')
    .setDescription('Start a Server on the Network')

    .addStringOption(option => option
        .setName('server')
        .setDescription('Select a Server to Start')
        .setRequired(true)
        .setAutocomplete(true)
    )



export const autocomplete = async (interaction: BaseInteraction) => {
    
}