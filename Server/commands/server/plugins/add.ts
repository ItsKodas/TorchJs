//? Dependencies

import Discord from "discord.js"

import ShardManager from "@lib/classes/shard"

import * as Autocomplete from "@lib/common/autocomplete"

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('add')
    .setDescription('Add a Package to this Server')
    .addStringOption(option => option
        .setName('server')
        .setDescription('Select a Server to add a Package to')
        .setRequired(true)
        .setAutocomplete(true)
    )

    .addStringOption(option => option
        .setName('pack')
        .setDescription('Select a Package to add to this Server')
        .setRequired(true)
        .setAutocomplete(true)
    )



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const ShardId = interaction.options.getString('server') as string
    if (ShardId == '.') return interaction.reply({ content: 'There are no servers available.', ephemeral: true })

    const PackId = interaction.options.getString('pack') as string
    if (PackId == '.') return interaction.reply({ content: 'There are no plugin packages available.', ephemeral: true })


    const Shard = new ShardManager(interaction.guildId as string, ShardId)
    if (!await Shard.fetch().catch(() => false)) return interaction.reply({ content: 'A server with that ID does not exist!', ephemeral: true })


    Shard.addPluginPack(PackId)
        .then(pack => interaction.reply({ content: `${pack.name} has been successfully added to ${Shard.name}!`, ephemeral: true }))
        .catch(err => {
            console.error(err)
            interaction.reply({ content: `An error occurred while adding this plugin package to the server!\n\n**Details**\n\`${err}\``, ephemeral: true })
        })

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => {

    if (interaction.options.getFocused(true).name == 'server') return interaction.respond(await Autocomplete.Shards(interaction.guildId as string, interaction.options.getFocused()))
    if (interaction.options.getFocused(true).name == 'pack') return interaction.respond(await Autocomplete.PluginPacks(interaction.guildId as string, interaction.options.getFocused()))

}