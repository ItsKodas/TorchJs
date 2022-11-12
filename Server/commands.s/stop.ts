//? Dependencies

import { BaseInteraction, SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from "discord.js"

import { Collection } from '@lib/mongodb'
import { Guild } from '@lib/discord'



//? Builder

export const command = () => new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop a Server on the Network')

    .addStringOption(option => option
        .setName('server')
        .setDescription('Select a Server to Stop')
        .setRequired(true)
        .setAutocomplete(true)
    )



export const autocomplete = async (interaction: BaseInteraction) => {

}