//? Dependencies

import Discord from "discord.js"

import ShardManager from "@lib/classes/shard"

import { Shards } from '@lib/common/autocomplete'

import * as Colors from '@lib/discord/colors'
import Alert from "@lib/discord/alert"



//? Command

export const data = new Discord.SlashCommandSubcommandBuilder()
    .setName('edit')
    .setDescription('Edit a Server on the Network')
    .addStringOption(option => option
        .setName('server')
        .setDescription('Select a Server to Edit')
        .setRequired(true)
        .setAutocomplete(true)
    )

    .addStringOption(option => option.setName('name').setDescription('Set the Display Name for this Server'))

    .addStringOption(option => option.setName('servername').setDescription('Set the Server Name for this Server'))
    .addStringOption(option => option.setName('worldname').setDescription('Set the World Name for this Server (Overrides the Loaded World Name)'))
    .addStringOption(option => option.setName('world').setDescription('Set the Current World Save'))

    .addIntegerOption(option => option.setName('maxplayers').setDescription('Set the Maximum Number of Players that can join this Server').setMinValue(1).setMaxValue(100))
    .addIntegerOption(option => option.setName('port').setDescription('Set the Listening Port that this Server will use').setMinValue(1).setMaxValue(65535))
    .addStringOption(option => option.setName('password').setDescription('Set a Password for the Server'))



//? Response

export const response = async (interaction: Discord.ChatInputCommandInteraction) => {

    const ShardId = interaction.options.getString('server') as string


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
            interaction.reply({ content: `${ShardId} has been successfully updated on the network!\n\`\`\`json\n${JSON.stringify(Shard.settings, null, '\t')}\`\`\``, ephemeral: true })

            Alert(interaction.guildId as string, false, [
                new Discord.EmbedBuilder()
                    .setTitle(`Server "${ShardId}" settings have been Updated`)
                    .setDescription(`The server "${ShardId}" has been updated by ${interaction.user}`)
                    .setColor(Colors.success)
                    .setFields([
                        { name: 'Before', value: `\`\`\`json\n${JSON.stringify(Before.settings, null, '\t')}\`\`\`` },
                        { name: 'After', value: `\`\`\`json\n${JSON.stringify(Shard.settings, null, '\t')}\`\`\`` }
                    ])
            ])

        })
        .catch(err => {
            console.error(err)
            interaction.reply({ content: 'An error occurred while editing the server.', ephemeral: true })
        })

}



//? Autocomplete

export const autocomplete = async (interaction: Discord.AutocompleteInteraction) => interaction.respond(await Shards(interaction.guildId as string, interaction.options.getFocused()))