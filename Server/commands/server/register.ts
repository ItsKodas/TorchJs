//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import ShardManager from "@lib/classes/shard"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const ShardId = interaction.options.getString('id')?.toLowerCase()
    if (!ShardId) return interaction.reply({ content: 'You must provide a server ID.', ephemeral: true })

    if (ShardId.match(/[^a-z0-9_-]/)) return interaction.reply({ content: 'Server ID must contain only Letters, Numbers, Hyphens and Underscores.', ephemeral: true })


    const Shard = new ShardManager(interaction.guildId as string, ShardId)
    if (await Shard.fetch().catch(() => false)) return interaction.reply({ content: 'A server with that ID already exists!', ephemeral: true })


    Shard.save()
        .then(() => {
            interaction.reply({ content: `Server "${ShardId}" has been successfully registered!`, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new EmbedBuilder()
                    .setTitle(`New Server "${ShardId}" has been Registered`)
                    .setDescription(`A New Server Identified by "${ShardId}" has been registered by ${interaction.user}`)
                    .setColor(Colors.success)
            ])

            Update_Commands(interaction.guildId as string, ['servers'])
        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: 'An error occurred while registering the server.', ephemeral: true })
        })


}