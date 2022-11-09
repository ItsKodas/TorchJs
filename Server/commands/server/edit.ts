//? Dependencies

import { ChatInputCommandInteraction, CacheType, Guild, EmbedBuilder } from "discord.js"

import ShardManager from "@lib/classes/shard"

import Update_Commands from '@lib/discord/commands'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export default async (interaction: ChatInputCommandInteraction<CacheType>) => {

    const ShardId = interaction.options.getString('server') as string
    if (ShardId == '.') return interaction.reply({ content: 'There are no servers available.', ephemeral: true })


    const Shard = new ShardManager(interaction.guildId as string, ShardId)
    if (!await Shard.fetch().catch(() => false)) return interaction.reply({ content: 'A server with that ID does not exist!', ephemeral: true })

    const Before = Shard


    Shard.name = interaction.options.getString('name') as string || Shard.name

    Shard.settings = {
        servername: interaction.options.getString('servername') as string || Shard.settings.servername,
        worldname: interaction.options.getString('worldname') as string || Shard.settings.worldname,

        port: interaction.options.getInteger('port') as number || Shard.settings.port,
        maxplayers: interaction.options.getInteger('maxplayers') as number || Shard.settings.maxplayers,
        password: Shard.settings.password,

        world: interaction.options.getString('world') as string || Shard.settings.world
    }

    if (interaction.options.getString('password')) await Shard.setPassword(interaction.options.getString('password') as string)


    Shard.save()
        .then(() => {
            interaction.reply({ content: `${ShardId} has been successfully updated on the network!\n\`\`\`json\n${JSON.stringify(Shard, null, '\t')}\`\`\``, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new EmbedBuilder()
                    .setTitle(`Server "${ShardId}" settings have been Updated`)
                    .setDescription(`The server "${ShardId}" has been updated by ${interaction.user}`)
                    .setColor(Colors.success)
                    .setFields([
                        { name: 'Before', value: `\`\`\`json\n${JSON.stringify(Before.settings, null, '\t')}\`\`\`` },
                        { name: 'After', value: `\`\`\`json\n${JSON.stringify(Shard.settings, null, '\t')}\`\`\`` }
                    ])
            ])

            Update_Commands(interaction.guildId as string, ['servers'])

        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: 'An error occurred while editing the server.', ephemeral: true })
        })

}